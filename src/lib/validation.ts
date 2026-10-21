import { z } from "zod";
import { trades } from "@/config/site";

export const LIMITS = {
  name: 100,
  business: 120,
  phone: 30,
  email: 254,
  message: 1000,
} as const;

/** Minimum time between the form rendering and submit. Anything faster is a bot. */
export const MIN_FILL_MS = 3000;

/** US numbers: 10 digits, or 11 starting with a 1 country code. Formatting characters are ignored. */
export function normalizeUsPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (ten.length !== 10) return null;
  // Area code and exchange can't start with 0 or 1 (NANP).
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(ten)) return null;
  return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
}

const emailFormat = z.email();

/** The fields a person fills in. Shared by the form (client) and /api/contact (server). */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(LIMITS.name, `Keep your name under ${LIMITS.name} characters.`),
  business: z
    .string()
    .trim()
    .min(1, "Enter your business name.")
    .max(LIMITS.business, `Keep the business name under ${LIMITS.business} characters.`),
  phone: z
    .string()
    .trim()
    .min(1, "Enter a phone number.")
    .max(LIMITS.phone, "Enter a 10-digit US phone number, like 315-555-0100.")
    .refine((v) => normalizeUsPhone(v) !== null, "Enter a 10-digit US phone number, like 315-555-0100.")
    .transform((v) => normalizeUsPhone(v) as string),
  email: z
    .string()
    .trim()
    .max(LIMITS.email, "Enter a valid email address or leave it blank.")
    .refine((v) => v === "" || emailFormat.safeParse(v).success, "Enter a valid email address or leave it blank.")
    .optional()
    .default(""),
  trade: z.enum(trades, { error: "Choose your trade." }),
  message: z
    .string()
    .trim()
    .max(LIMITS.message, `Keep the message under ${LIMITS.message.toLocaleString("en-US")} characters.`)
    .optional()
    .default(""),
  consent: z.boolean().optional().default(false),
});

export type ContactInput = z.input<typeof contactSchema>;
export type Lead = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** What the browser actually posts: the fields plus the two spam traps. Unknown keys are stripped. */
export const submissionSchema = contactSchema.extend({
  website: z.string().max(500).optional(), // honeypot: real people never fill it
  startedAt: z.number().int().optional(), // ms timestamp from when the form rendered
});

/** True when either spam trap trips. The caller answers exactly like a success. */
export function isSpam(traps: { website?: unknown; startedAt?: unknown }, now: number): boolean {
  if (typeof traps.website === "string" && traps.website.trim() !== "") return true;
  if (typeof traps.startedAt !== "number" || !Number.isFinite(traps.startedAt)) return true;
  const elapsed = now - traps.startedAt;
  return elapsed < MIN_FILL_MS || elapsed > 1000 * 60 * 60 * 24; // too fast, or a replayed day-old token
}

/** First error message per field, for inline display. */
export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
