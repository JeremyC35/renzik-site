import { describe, expect, it } from "vitest";
import { contactSchema, isSpam, LIMITS, MIN_FILL_MS, normalizeUsPhone, submissionSchema } from "@/lib/validation";

const valid = {
  name: "Dana Reyes",
  business: "Reyes Roofing",
  phone: "315-555-0188",
  email: "dana@example.com",
  trade: "Roofing",
  message: "Missing calls after 6 p.m.",
  consent: true,
};

describe("contactSchema", () => {
  it("accepts a valid lead and normalizes the phone", () => {
    const r = contactSchema.safeParse(valid);
    expect(r.success).toBe(true);
    expect(r.success && r.data.phone).toBe("(315) 555-0188");
  });

  it("accepts a lead with only the required fields", () => {
    const r = contactSchema.safeParse({ name: "A", business: "B", phone: "3155550188", trade: "HVAC" });
    expect(r.success).toBe(true);
    expect(r.success && r.data).toMatchObject({ email: "", message: "", consent: false });
  });

  it.each(["name", "business", "phone", "trade"] as const)("rejects a missing %s", (field) => {
    const r = contactSchema.safeParse({ ...valid, [field]: field === "trade" ? undefined : "   " });
    expect(r.success).toBe(false);
    expect(r.success || r.error.issues[0].path[0]).toBe(field);
  });

  it("rejects oversize fields", () => {
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(LIMITS.message + 1) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, name: "x".repeat(LIMITS.name + 1) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, business: "x".repeat(LIMITS.business + 1) }).success).toBe(false);
  });

  it.each(["555-0188", "123-456-7890", "315-155-0188", "+44 20 7946 0958", "phone me"])(
    "rejects bad phone %s",
    (phone) => {
      expect(contactSchema.safeParse({ ...valid, phone }).success).toBe(false);
    },
  );

  it("rejects a bad email but allows an empty one", () => {
    expect(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
  });

  it("rejects a trade outside the list", () => {
    expect(contactSchema.safeParse({ ...valid, trade: "Landscaping" }).success).toBe(false);
  });

  it("trims strings and strips unknown fields", () => {
    const r = submissionSchema.safeParse({ ...valid, name: "  Dana  ", isAdmin: true, startedAt: 1 });
    expect(r.success && r.data.name).toBe("Dana");
    expect(r.success && "isAdmin" in r.data).toBe(false);
  });
});

describe("normalizeUsPhone", () => {
  it("handles common formats and a leading 1", () => {
    for (const p of ["(315) 555-0188", "315.555.0188", "+1 315 555 0188", "13155550188"]) {
      expect(normalizeUsPhone(p)).toBe("(315) 555-0188");
    }
  });
});

describe("spam traps", () => {
  const now = 1_000_000;
  it("passes a person who took longer than the minimum", () => {
    expect(isSpam({ website: "", startedAt: now - MIN_FILL_MS - 1 }, now)).toBe(false);
  });
  it("flags a filled honeypot", () => {
    expect(isSpam({ website: "https://spam.example", startedAt: now - 60_000 }, now)).toBe(true);
  });
  it("flags a submit faster than 3 seconds", () => {
    expect(isSpam({ website: "", startedAt: now - 1200 }, now)).toBe(true);
  });
  it("flags a missing or bogus timestamp", () => {
    expect(isSpam({ website: "" }, now)).toBe(true);
    expect(isSpam({ website: "", startedAt: "yesterday" }, now)).toBe(true);
  });
});
