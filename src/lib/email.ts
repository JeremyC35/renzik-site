import { Resend } from "resend";
import { CONSENT_TEXT_VERSION } from "@/config/site";
import type { Lead } from "@/lib/validation";

export interface LeadEmail {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export type SendEmail = (email: LeadEmail) => Promise<{ ok: boolean }>;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Header values must stay on one line. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function formatNewYorkTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);
}

export function buildLeadEmail(lead: Lead, submittedAt: Date): LeadEmail {
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Business", lead.business],
    ["Phone", lead.phone],
    ["Email", lead.email || "(not provided)"],
    ["Trade", lead.trade],
    ["Message", lead.message || "(none)"],
    ["Consent to calls/texts", lead.consent ? "Yes" : "No"],
    ["Consent text version", CONSENT_TEXT_VERSION],
    ["Submitted", formatNewYorkTime(submittedAt)],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
    .map(
      ([k, v]) =>
        `<tr><th align="left" valign="top" style="color:#54524A;font-weight:600">${escapeHtml(k)}</th><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;

  return {
    subject: oneLine(`New lead: ${lead.business} (${lead.trade})`),
    text,
    html,
    replyTo: lead.email || undefined,
  };
}

/** Resend sender. Returns null when email isn't configured, so the route can answer 503. */
export function createResendSender(env: Record<string, string | undefined> = process.env): SendEmail | null {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) return null;
  const resend = new Resend(RESEND_API_KEY);
  return async (email) => {
    try {
      const { error } = await resend.emails.send({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL,
        subject: email.subject,
        text: email.text,
        html: email.html,
        ...(email.replyTo ? { replyTo: email.replyTo } : {}),
      });
      return { ok: !error };
    } catch {
      return { ok: false };
    }
  };
}
