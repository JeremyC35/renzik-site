import { contactSchema, isSpam, submissionSchema, fieldErrors } from "@/lib/validation";
import { buildLeadEmail, type SendEmail } from "@/lib/email";
import { clientIp, type Limiter } from "@/lib/ratelimit";

export const MAX_BODY_BYTES = 10 * 1024;

export type Outcome =
  | "sent"
  | "spam"
  | "rejected-validation"
  | "rejected-origin"
  | "rejected-content-type"
  | "rejected-size"
  | "rate-limited"
  | "email-failed"
  | "unavailable";

export interface ContactDeps {
  allowedOrigins: string[];
  getLimiter: () => Limiter | null;
  getSender: () => SendEmail | null;
  now?: () => number;
  /** Receives only the timestamp and the outcome. Never form content. */
  log?: (entry: { ts: string; outcome: Outcome }) => void;
}

export const defaultLog = (entry: { ts: string; outcome: Outcome }) => console.info(JSON.stringify(entry));

export function parseAllowedOrigins(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((o) => o.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

const json = (
  status: number,
  body: { ok: true } | { ok: false; error: string; fields?: Record<string, string> },
  headers?: HeadersInit,
) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

const fail = (status: number, error: string, headers?: HeadersInit) => json(status, { ok: false, error }, headers);

/** Reads the body as text, giving up as soon as it exceeds `limit` bytes. */
async function readLimited(req: Request, limit: number): Promise<string | null> {
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export function methodNotAllowed(): Response {
  return fail(405, "Use POST to send this form.", { Allow: "POST" });
}

export function createContactHandler(deps: ContactDeps) {
  const now = deps.now ?? Date.now;
  const log = deps.log ?? defaultLog;
  const record = (outcome: Outcome) => log({ ts: new Date(now()).toISOString(), outcome });

  return async function POST(req: Request): Promise<Response> {
    const origin = req.headers.get("origin")?.replace(/\/+$/, "");
    if (!origin || !deps.allowedOrigins.includes(origin)) {
      record("rejected-origin");
      return fail(403, "This form can only be sent from the Renzik website.");
    }

    const type = req.headers.get("content-type") ?? "";
    if (!/^application\/json\b/i.test(type)) {
      record("rejected-content-type");
      return fail(415, "Send the form as JSON.");
    }

    const declared = Number(req.headers.get("content-length") ?? "0");
    const raw = declared > MAX_BODY_BYTES ? null : await readLimited(req, MAX_BODY_BYTES);
    if (raw === null) {
      record("rejected-size");
      return fail(413, "That message is too long. Shorten it and try again.");
    }

    const limiter = deps.getLimiter();
    if (!limiter) {
      record("unavailable");
      return fail(503, "The form is temporarily unavailable. Please try again later.");
    }
    const { success } = await limiter.limit(clientIp(req.headers));
    if (!success) {
      record("rate-limited");
      return fail(429, "Too many requests. Wait 10 minutes, then try again.", { "Retry-After": "600" });
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      record("rejected-validation");
      return fail(400, "The form data couldn't be read. Reload the page and try again.");
    }

    // Spam traps first: a bot gets the same answer as a person and nothing is sent.
    const traps = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
    if (isSpam({ website: traps.website, startedAt: traps.startedAt }, now())) {
      record("spam");
      return json(200, { ok: true });
    }

    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      record("rejected-validation");
      return json(400, {
        ok: false,
        error: "Some fields need fixing. Check the highlighted fields and try again.",
        fields: fieldErrors(parsed.error),
      });
    }

    const send = deps.getSender();
    if (!send) {
      record("email-failed");
      return fail(503, "The form is temporarily unavailable. Please try again later.");
    }

    const lead = contactSchema.parse(parsed.data); // drops the trap fields
    const result = await send(buildLeadEmail(lead, new Date(now())));
    if (!result.ok) {
      record("email-failed");
      return fail(502, "Your request didn't go through. Try again in a few minutes.");
    }

    record("sent");
    return json(200, { ok: true });
  };
}
