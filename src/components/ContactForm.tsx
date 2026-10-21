"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { trades } from "@/config/site";
import { contactSchema, fieldErrors, LIMITS, type ContactField } from "@/lib/validation";

type Values = { name: string; business: string; phone: string; email: string; trade: string; message: string; consent: boolean };
type Errors = Partial<Record<ContactField, string>>;
type Status = "idle" | "sending" | "success";

const ORDER: ContactField[] = ["name", "business", "phone", "email", "trade", "message"];
const EMPTY: Values = { name: "", business: "", phone: "", email: "", trade: "", message: "", consent: false };

const inputClass =
  "mt-2 block min-h-11 w-full rounded-ui border border-stone bg-paper px-3 py-2.5 text-base text-ink placeholder:text-stone aria-[invalid=true]:border-2 aria-[invalid=true]:border-error";

export function ContactForm({ consentText, contactEmail }: { consentText: string | null; contactEmail: string | null }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [ready, setReady] = useState(false);
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>>>({});

  useEffect(() => {
    // The form is disabled until JavaScript runs, so it can never submit without it (see <noscript>).
    startedAt.current = Date.now();
    setReady(true);
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const showErrors = (next: Errors) => {
    setErrors(next);
    const first = ORDER.find((f) => next[f]);
    const count = ORDER.filter((f) => next[f]).length;
    setAnnouncement(`${count} ${count === 1 ? "field needs" : "fields need"} fixing.`);
    if (first) fieldRefs.current[first]?.focus();
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setFormError("");

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      showErrors(fieldErrors(parsed.error));
      return;
    }

    setStatus("sending");
    setAnnouncement("Sending…");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot.current?.value ?? "", startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; fields?: Errors } | null;
      if (res.ok && data?.ok) {
        setStatus("success");
        setAnnouncement("");
        return;
      }
      setStatus("idle");
      if (data?.fields && Object.keys(data.fields).length) showErrors(data.fields);
      const message = data?.error ?? "Your request didn't go through. Try again in a few minutes.";
      setFormError(message);
      setAnnouncement(message);
    } catch {
      setStatus("idle");
      const message = "Couldn't reach the server. Check your connection and try again.";
      setFormError(message);
      setAnnouncement(message);
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border-l-4 border-pine py-2 pl-6 outline-none">
        <p className="text-2xl font-bold">Got it. We&apos;ll reach out within one business day.</p>
      </div>
    );
  }

  const describedBy = (field: ContactField, extra?: string) =>
    [errors[field] ? `${field}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  const err = (field: ContactField) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-2 text-sm font-semibold text-error">
        {errors[field]}
      </p>
    ) : null;

  const label = (field: ContactField, text: string, optional = false) => (
    <label htmlFor={field} className="block font-semibold">
      {text}
      {optional && <span className="font-normal text-stone"> (optional)</span>}
    </label>
  );

  const ref = (field: ContactField) => (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => {
    fieldRefs.current[field] = el;
  };

  return (
    <>
      <noscript>
        <p className="mb-6 border-l-4 border-error pl-4 font-semibold">
          This form needs JavaScript to send.{" "}
          {contactEmail ? (
            <>
              Turn it on, or email us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </>
          ) : (
            "Turn it on in your browser settings, then reload the page."
          )}
        </p>
      </noscript>

      <form onSubmit={onSubmit} noValidate aria-label="Book a call">
        <fieldset disabled={!ready || status === "sending"} className="grid gap-6 sm:grid-cols-2">
          <legend className="sr-only">Your details</legend>

          <div>
            {label("name", "Your name")}
            <input id="name" ref={ref("name")} name="name" autoComplete="name" required maxLength={LIMITS.name}
              value={values.name} onChange={(e) => set("name", e.target.value)}
              aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} className={inputClass} />
            {err("name")}
          </div>

          <div>
            {label("business", "Business name")}
            <input id="business" ref={ref("business")} name="business" autoComplete="organization" required maxLength={LIMITS.business}
              value={values.business} onChange={(e) => set("business", e.target.value)}
              aria-invalid={Boolean(errors.business)} aria-describedby={describedBy("business")} className={inputClass} />
            {err("business")}
          </div>

          <div>
            {label("phone", "Phone")}
            <input id="phone" ref={ref("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel-national" required
              maxLength={LIMITS.phone} value={values.phone} onChange={(e) => set("phone", e.target.value)}
              aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone")} className={inputClass} />
            {err("phone")}
          </div>

          <div>
            {label("email", "Email", true)}
            <input id="email" ref={ref("email")} name="email" type="email" autoComplete="email" maxLength={LIMITS.email}
              value={values.email} onChange={(e) => set("email", e.target.value)}
              aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} className={inputClass} />
            {err("email")}
          </div>

          <div className="sm:col-span-2">
            {label("trade", "Your trade")}
            <select id="trade" ref={ref("trade")} name="trade" required value={values.trade} onChange={(e) => set("trade", e.target.value)}
              aria-invalid={Boolean(errors.trade)} aria-describedby={describedBy("trade")} className={inputClass}>
              <option value="" disabled>
                Choose one
              </option>
              {trades.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {err("trade")}
          </div>

          <div className="sm:col-span-2">
            {label("message", "Anything we should know?", true)}
            <textarea id="message" ref={ref("message")} name="message" rows={4} maxLength={LIMITS.message}
              value={values.message} onChange={(e) => set("message", e.target.value)}
              aria-invalid={Boolean(errors.message)} aria-describedby={describedBy("message", "message-hint")} className={inputClass} />
            <p id="message-hint" className="mt-2 text-sm text-stone">
              Up to {LIMITS.message.toLocaleString("en-US")} characters.
            </p>
            {err("message")}
          </div>

          {consentText && (
            <div className="flex gap-3 sm:col-span-2">
              <input id="consent" name="consent" type="checkbox" checked={values.consent}
                onChange={(e) => set("consent", e.target.checked)} className="mt-1 size-5 shrink-0 accent-pine" />
              <label htmlFor="consent" className="text-sm leading-relaxed">
                {consentText}
              </label>
            </div>
          )}

          {/* Honeypot: off-screen (not display:none), skipped by keyboard, ignored by password managers. */}
          <div className="absolute -left-[10000px] h-px w-px overflow-hidden">
            <label htmlFor="website">Leave this field empty.</label>
            <input id="website" ref={honeypot} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          <div className="sm:col-span-2">
            <button type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-ui bg-pine px-6 py-2.5 text-base font-semibold whitespace-nowrap text-paper transition-colors hover:bg-pine-deep active:bg-pine-deep disabled:opacity-70">
              {status === "sending" ? "Sending…" : "Book a call"}
            </button>
            {formError && (
              <p className="mt-4 font-semibold text-error" role="alert">
                {formError}
              </p>
            )}
          </div>
        </fieldset>
        <p id="form-status" aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </form>
    </>
  );
}
