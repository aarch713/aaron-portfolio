import { z } from "zod";

/**
 * Chat request payload — validated at the /api/chat boundary.
 * Hard caps keep prompt size (and cost) bounded: at most 20 turns of
 * history, each turn at most 1,000 characters.
 */
export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(1000),
      }),
    )
    .min(1)
    .max(20),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

const MS_PER_UTC_DAY = 86_400_000;
const DEFAULT_DAILY_LIMIT = 200;

/* Module-level counter: one per serverless instance, reset on UTC-day
 * rollover. Deliberately approximate — it exists to cap worst-case daily
 * spend, not to be a precise distributed quota. */
let usedToday = 0;
let currentUtcDay = -1;

/**
 * Returns true (and consumes one slot) while today's usage is under the
 * limit; false once the cap is hit. The counter resets when the UTC day
 * of `now` differs from the day of the last call.
 */
export function checkDailyCap(
  limit: number = DEFAULT_DAILY_LIMIT,
  now: number = Date.now(),
): boolean {
  const utcDay = Math.floor(now / MS_PER_UTC_DAY);
  if (utcDay !== currentUtcDay) {
    currentUtcDay = utcDay;
    usedToday = 0;
  }
  if (usedToday >= limit) {
    return false;
  }
  usedToday += 1;
  return true;
}

/** Test hook: clears the module-level counter and day stamp. */
export function resetDailyCap(): void {
  usedToday = 0;
  currentUtcDay = -1;
}
