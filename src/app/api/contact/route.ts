import { createContactHandler, methodNotAllowed, parseAllowedOrigins } from "@/lib/contact-handler";
import { getLimiter } from "@/lib/ratelimit";
import { createResendSender } from "@/lib/email";

export const POST = createContactHandler({
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
  getLimiter: () => getLimiter(),
  getSender: () => createResendSender(),
});

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
