/** Field length caps. Kept separate from validation.ts so the form can use them without loading zod up front. */
export const LIMITS = {
  name: 100,
  business: 120,
  phone: 30,
  email: 254,
  message: 1000,
} as const;

export type ContactField = "name" | "business" | "phone" | "email" | "trade" | "message";
