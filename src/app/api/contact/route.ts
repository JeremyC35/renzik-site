import { createContactHandler, methodNotAllowed, resolveAllowedOrigins } from "@/lib/contact-handler";
import { getLimiter } from "@/lib/ratelimit";
import { createResendSender } from "@/lib/email";

export const POST = createContactHandler({
  allowedOrigins: resolveAllowedOrigins(process.env),
  getLimiter: () => getLimiter(),
  getSender: () => createResendSender(),
});

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
