"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { contactSchema } from "@/lib/validation";

type FormStatus = "idle" | "pending" | "success" | "error";
type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const INVALID_COPY: Record<FieldName, string> = {
  name: "Add your name.",
  email: "Enter a valid email address.",
  message: "Say a bit more — at least 10 characters.",
};

const TOO_LONG_COPY: Record<FieldName, string> = {
  name: "Keep your name under 100 characters.",
  email: "Keep your email under 200 characters.",
  message: "Keep your message under 4,000 characters.",
};

const LABEL_CLASSES =
  "mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted";

/* Focus ring comes from the global :focus-visible outline (current-2) —
 * never suppressed here; the border shift just reinforces it. */
const INPUT_CLASSES =
  "w-full rounded-md border border-line bg-surface p-3 text-bone transition-colors duration-(--dur) focus:border-(--current-2)";

const ERROR_CLASSES = "mt-2 text-sm text-current-2";

function isFieldName(value: unknown): value is FieldName {
  return value === "name" || value === "email" || value === "message";
}

/**
 * Contact form: name / email / message with shared-schema (zod) inline
 * validation, a visually-hidden `company` honeypot, and a mount-time
 * `startedAt` timestamp. POSTs JSON to /api/contact; success swaps the form
 * for a confirmation, failure keeps the form filled and offers a mailto
 * fallback.
 */
export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const startedAtRef = useRef(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
      startedAt: startedAtRef.current,
    };

    const result = contactSchema.safeParse(payload);
    const errors: FieldErrors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (isFieldName(field) && !errors[field]) {
          errors[field] =
            issue.code === "too_big"
              ? TOO_LONG_COPY[field]
              : INVALID_COPY[field];
        }
      }
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus("idle");
      return;
    }
    /* Issues outside the visible fields (honeypot, timestamp) fall through
     * to the server, which owns that rejection. */

    setStatus("pending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Contact API responded ${response.status}`);
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-md border border-line bg-surface p-6"
      >
        <p className="text-bone">
          Message sent — I&apos;ll reply from{" "}
          <span className="font-mono text-current-2">{profile.email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative flex flex-col gap-6"
    >
      <div>
        <label htmlFor="contact-name" className={LABEL_CLASSES}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          className={INPUT_CLASSES}
        />
        {fieldErrors.name ? (
          <p id="contact-name-error" role="alert" className={ERROR_CLASSES}>
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className={LABEL_CLASSES}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={
            fieldErrors.email ? "contact-email-error" : undefined
          }
          className={INPUT_CLASSES}
        />
        {fieldErrors.email ? (
          <p id="contact-email-error" role="alert" className={ERROR_CLASSES}>
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className={LABEL_CLASSES}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={
            fieldErrors.message ? "contact-message-error" : undefined
          }
          className={`${INPUT_CLASSES} resize-y`}
        />
        {fieldErrors.message ? (
          <p id="contact-message-error" role="alert" className={ERROR_CLASSES}>
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot — visually hidden (not display:none, so bots still fill it),
          removed from the tab order and the accessibility tree. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="flex flex-col items-start gap-4">
        {/* Plain button styled to match MagneticButton's solid variant —
            the primitive doesn't support type="submit". */}
        <button
          type="submit"
          disabled={status === "pending"}
          className="group relative inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium tracking-tight text-ink select-none disabled:cursor-default disabled:opacity-70"
        >
          <span
            aria-hidden="true"
            className="absolute -inset-[3px] rounded-full opacity-0 blur-[3px] transition-opacity duration-(--dur) group-hover:opacity-70 group-focus-visible:opacity-70"
            style={{
              background:
                "linear-gradient(100deg, var(--current-1), var(--current-2))",
            }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-bone"
          />
          <span className="relative">
            {status === "pending" ? "Sending..." : "Send message"}
          </span>
        </button>

        {status === "error" ? (
          <p role="alert" className="text-sm text-muted">
            Something broke — email me directly at{" "}
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-bone underline decoration-line underline-offset-4 transition-colors duration-(--dur) hover:text-current-2"
            >
              {profile.email}
            </a>
            .
          </p>
        ) : null}
      </div>
    </form>
  );
}
