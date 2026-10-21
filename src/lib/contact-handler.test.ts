import { describe, expect, it, vi } from "vitest";
import {
  createContactHandler,
  MAX_BODY_BYTES,
  methodNotAllowed,
  parseAllowedOrigins,
  type ContactDeps,
} from "@/lib/contact-handler";
import { createMemoryLimiter } from "@/lib/ratelimit";
import type { LeadEmail } from "@/lib/email";

const ORIGIN = "https://renzik-site-preview.vercel.app";
const NOW = 1_800_000_000_000;

const lead = {
  name: "Dana Reyes",
  business: "Reyes Roofing <script>",
  phone: "315-555-0188",
  email: "dana@example.com",
  trade: "Roofing",
  message: "Calls after 6 p.m. go to voicemail",
  consent: true,
  website: "",
  startedAt: NOW - 10_000,
};

function setup(overrides: Partial<ContactDeps> = {}) {
  const sent: LeadEmail[] = [];
  const logs: unknown[] = [];
  const send = vi.fn(async (email: LeadEmail) => {
    sent.push(email);
    return { ok: true };
  });
  const limiter = createMemoryLimiter(5, 600_000);
  const POST = createContactHandler({
    allowedOrigins: [ORIGIN],
    getLimiter: () => limiter,
    getSender: () => send,
    now: () => NOW,
    log: (e) => logs.push(e),
    ...overrides,
  });
  return { POST, send, sent, logs };
}

function request(
  body: unknown,
  init: { origin?: string | null; contentType?: string; ip?: string; raw?: string } = {},
) {
  const headers = new Headers({
    "content-type": init.contentType ?? "application/json",
    "x-real-ip": init.ip ?? "203.0.113.7",
  });
  if (init.origin !== null) headers.set("origin", init.origin ?? ORIGIN);
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers,
    body: init.raw ?? JSON.stringify(body),
  });
}

describe("/api/contact", () => {
  it("returns 405 with Allow: POST for other methods", async () => {
    const res = methodNotAllowed();
    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toBe("POST");
  });

  it("returns 415 for a non-JSON content type", async () => {
    const { POST, send } = setup();
    const res = await POST(request(lead, { contentType: "application/x-www-form-urlencoded" }));
    expect(res.status).toBe(415);
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 413 for a body over 10 KB", async () => {
    const { POST, send } = setup();
    const res = await POST(request(null, { raw: JSON.stringify({ ...lead, message: "x".repeat(MAX_BODY_BYTES) }) }));
    expect(res.status).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 403 for a missing or unknown origin", async () => {
    const { POST, send } = setup();
    expect((await POST(request(lead, { origin: "https://evil.example" }))).status).toBe(403);
    expect((await POST(request(lead, { origin: null }))).status).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 429 on the sixth request in ten minutes from one IP", async () => {
    const { POST } = setup();
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await POST(request(lead, { ip: "198.51.100.9" }))).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    // A different IP is unaffected.
    expect((await POST(request(lead, { ip: "198.51.100.10" }))).status).toBe(200);
  });

  it("fails closed with 503 when no rate limiter is configured", async () => {
    const { POST, send } = setup({ getLimiter: () => null });
    expect((await POST(request(lead))).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 400 with field errors for invalid input", async () => {
    const { POST, send } = setup();
    const res = await POST(request({ ...lead, phone: "12" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.fields.phone).toMatch(/10-digit/);
    expect(send).not.toHaveBeenCalled();
  });

  it("answers a filled honeypot exactly like a success and sends nothing", async () => {
    const { POST, send, logs } = setup();
    const res = await POST(request({ ...lead, website: "https://spam.example" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
    expect(logs).toEqual([{ ts: new Date(NOW).toISOString(), outcome: "spam" }]);
  });

  it("answers a too-fast submit like a success and sends nothing", async () => {
    const { POST, send } = setup();
    const res = await POST(request({ ...lead, startedAt: NOW - 500 }));
    expect(await res.json()).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it("sends the lead email on success (Resend mocked)", async () => {
    const { POST, sent } = setup();
    const res = await POST(request(lead));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sent).toHaveLength(1);
    const email = sent[0];
    expect(email.subject).toBe("New lead: Reyes Roofing <script> (Roofing)");
    expect(email.replyTo).toBe("dana@example.com");
    expect(email.text).toContain("Phone: (315) 555-0188");
    expect(email.text).toContain("Consent to calls/texts: Yes");
    expect(email.text).toContain("Consent text version: 2026-09-draft");
    expect(email.text).toMatch(/Submitted: .*(EDT|EST)/);
    expect(email.html).toContain("Reyes Roofing &lt;script&gt;");
    expect(email.html).not.toContain("<script>");
  });

  it("returns 502 with a user-safe message when the email provider fails", async () => {
    const { POST } = setup({ getSender: () => async () => ({ ok: false }) });
    const res = await POST(request(lead));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body).toEqual({ ok: false, error: expect.any(String) });
    expect(JSON.stringify(body)).not.toMatch(/resend|stack|Error:/i);
  });

  it("never logs form content, only a timestamp and an outcome", async () => {
    const { POST, logs } = setup();
    const spy = vi.spyOn(console, "info");
    await POST(request(lead));
    await POST(request({ ...lead, phone: "bad" }));
    await POST(request(lead, { origin: "https://evil.example" }));
    const everything = JSON.stringify(logs) + JSON.stringify(spy.mock.calls);
    for (const value of ["Dana", "Reyes", "315", "dana@example.com", "voicemail"]) {
      expect(everything).not.toContain(value);
    }
    for (const entry of logs) expect(Object.keys(entry as object).sort()).toEqual(["outcome", "ts"]);
    spy.mockRestore();
  });
});

describe("parseAllowedOrigins", () => {
  it("splits, trims and drops trailing slashes", () => {
    expect(parseAllowedOrigins(" https://a.example/ , http://localhost:3000")).toEqual([
      "https://a.example",
      "http://localhost:3000",
    ]);
    expect(parseAllowedOrigins(undefined)).toEqual([]);
  });
});
