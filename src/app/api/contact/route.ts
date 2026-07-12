import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { contactSchema } from "@/lib/validation";
import { dailyCap, rateLimit, sanitizeHeaderText } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Submissions faster than this are bot-speed; accept silently, send nothing. */
const MIN_FILL_TIME_MS = 3_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60_000;
/** Global sends per UTC day — keeps one polite attacker from burning
 * Resend's 100/day free quota across many IPs. */
const DAILY_CAP_NAME = "contact";
const DAILY_CAP_MAX = 50;

const OFFLINE_ERROR = "Form is offline — email aarch713@gmail.com directly.";
const FALLBACK_TO_EMAIL = "aarch713@gmail.com";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || "unknown";
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Check the form fields",
        issues: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const { name, email, message, startedAt } = parsed.data;

  // Bot-speed submission: pretend success so scripts learn nothing.
  if (Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(request);
  if (!rateLimit(`contact:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many messages — try again later." },
      { status: 429 },
    );
  }

  // Global daily cap: after the per-IP check so throttled IPs can't burn it.
  if (!dailyCap(DAILY_CAP_NAME, DAILY_CAP_MAX)) {
    return NextResponse.json({ error: OFFLINE_ERROR }, { status: 503 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: OFFLINE_ERROR }, { status: 503 });
  }

  const safeName = sanitizeHeaderText(name);
  const safeEmail = sanitizeHeaderText(email);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL ?? FALLBACK_TO_EMAIL,
      replyTo: safeEmail,
      subject: `Portfolio contact from ${safeName}`,
      text: `From: ${safeName} <${safeEmail}>\n\n${message}`,
    });
    if (error) {
      return NextResponse.json({ error: OFFLINE_ERROR }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: OFFLINE_ERROR }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
