import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { CHAT_CORPUS } from "@/content/chat-corpus";
import { chatRequestSchema, checkDailyCap } from "@/lib/chat-limits";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 512;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;

const GUARDRAILS = [
  "You are the assistant on Aaron Chai's portfolio site.",
  "Answer ONLY from the corpus below. If the answer isn't in it, say you",
  "don't know and point to the resume PDF (/resume/Aaron_Chai_Resume.pdf).",
  "Never invent employers, dates, or numbers. Decline off-topic requests",
  "politely and steer back to Aaron's work. Keep answers under 150 words.",
].join(" ");

const SYSTEM = `${GUARDRAILS}\n\n--- CORPUS ---\n\n${CHAT_CORPUS}`;

const RESTING_FALLBACK =
  "Chat is resting — grab the resume PDF at /resume/Aaron_Chai_Resume.pdf instead.";
const RATE_FALLBACK = "Slow down a little — try again in a few minutes.";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be JSON." },
      { status: 400 },
    );
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request: expected 1-20 messages, each 1-1000 characters." },
      { status: 400 },
    );
  }

  const ip = clientIp(request);
  if (!rateLimit(`chat:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ fallback: RATE_FALLBACK }, { status: 429 });
  }

  if (!process.env.ANTHROPIC_API_KEY || !checkDailyCap()) {
    return NextResponse.json({ fallback: RESTING_FALLBACK }, { status: 200 });
  }

  const anthropic = new Anthropic();
  const messageStream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM,
    messages: parsed.data.messages,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch {
        /* Upstream abort/error mid-stream: end what we have gracefully —
         * the client keeps every delta already delivered. Never surface
         * provider internals to the browser. */
      } finally {
        try {
          controller.close();
        } catch {
          /* Already closed or cancelled — nothing left to do. */
        }
      }
    },
    cancel() {
      messageStream.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
