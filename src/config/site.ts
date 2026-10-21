/**
 * Every business fact on the site comes from this file. Unknown values use a
 * TODO_ token, and nowhere else in the codebase may contain placeholder text.
 * `npm run check:placeholders` lists them, and production builds fail while any remain.
 */

export const site = {
  tradeName: "Renzik",
  lockupName: "Renzik Automated Services",
  industry: "AI call answering and lead follow-up for home service contractors",
  serviceArea: "Central New York",
  serviceAreaDetail: "Utica, Rome, Syracuse and surrounding areas",
  serviceAreaLine: "Serving Central New York",

  legalEntityName: "TODO_LEGAL_ENTITY_NAME", // LLC filing pending
  mailingAddress: "TODO_MAILING_ADDRESS", // business mailing address, not a home address
  businessPhone: "TODO_BUSINESS_PHONE", // display format, e.g. (315) 555-0100
  contactEmail: "TODO_CONTACT_EMAIL",
  domain: "TODO_DOMAIN",
  legalEffectiveDate: "TODO_EFFECTIVE_DATE", // e.g. October 21, 2026
} as const;

/** Brand palette for places CSS tokens can't reach (OG image, browser theme color). Mirrors globals.css. */
export const palette = {
  pine: "#0F6E56",
  paper: "#F1EFE8",
  ink: "#1C1B17",
} as const;

/**
 * Shown next to the optional consent checkbox. The checkbox stays hidden until
 * this is real text. Draft for the lawyer to review:
 *
 *   "By checking this box, I agree that Renzik may contact me at the number
 *   provided by call or text, including with automated technology, about its
 *   services. Consent is not a condition of purchase. Message and data rates
 *   may apply. Reply STOP to opt out."
 */
export const tcpaConsentText = "TODO_TCPA_CONSENT_TEXT";

/** Bump whenever the consent wording changes. Every lead email records it. */
export const CONSENT_TEXT_VERSION = "2026-09-draft";

/** A stat renders only once its source is a real URL. */
export const problemStat = {
  text: "Roughly a quarter of calls to small businesses go unanswered.",
  source: "TODO_STAT_SOURCE_URL",
  sourceLabel: "Source",
};

export const trades = ["Roofing", "HVAC", "Plumbing", "General contractor", "Other"] as const;

/** True when a value is still a placeholder token. */
export function isPlaceholder(value: string): boolean {
  return value.startsWith("TODO_");
}

/** The value when it's real, otherwise null. Components render nothing for null. */
export function real(value: string): string | null {
  return isPlaceholder(value) ? null : value;
}

/** True while any business fact above is still a placeholder (drives the legal-page draft notice). */
export function hasPlaceholders(): boolean {
  const values: string[] = [...Object.values(site).map(String), tcpaConsentText, problemStat.source];
  return values.some(isPlaceholder);
}
