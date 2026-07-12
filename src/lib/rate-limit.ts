/**
 * In-memory sliding-window rate limiter.
 *
 * Suited to a single serverless/Node instance: state lives in a module-level
 * Map and resets on cold start. Good enough for a personal-site contact form;
 * swap for a shared store (Redis/KV) if the site ever runs multi-instance.
 */

const hits = new Map<string, number[]>();

/**
 * Upper bound on tracked buckets. An attacker who varies the key (spoofed
 * X-Forwarded-For values) would otherwise grow the Map without limit; once
 * the cap is exceeded the oldest-inserted keys are dropped (Map preserves
 * insertion order).
 */
export const MAX_RATE_LIMIT_KEYS = 5000;

function evictOldestKeys(): void {
  while (hits.size > MAX_RATE_LIMIT_KEYS) {
    const oldest = hits.keys().next().value;
    if (oldest === undefined) return;
    hits.delete(oldest);
  }
}

/**
 * Record a hit for `key` and report whether it is allowed.
 *
 * @param key      Bucket identifier, e.g. `contact:${ip}`.
 * @param max      Maximum allowed hits inside the window.
 * @param windowMs Sliding window length in milliseconds.
 * @param now      Clock injection point for tests; defaults to Date.now().
 * @returns true when the request is allowed, false when the bucket is full.
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number,
  now: number = Date.now(),
): boolean {
  const cutoff = now - windowMs;
  const live = (hits.get(key) ?? []).filter((ts) => ts > cutoff);

  if (live.length >= max) {
    hits.set(key, live);
    return false;
  }

  hits.set(key, [...live, now]);
  evictOldestKeys();
  return true;
}

/** Clear all buckets — test helper only. */
export function resetRateLimits(): void {
  hits.clear();
}

const MS_PER_UTC_DAY = 86_400_000;

interface DailyCounter {
  utcDay: number;
  used: number;
}

/* Module-level counters: one per serverless instance, reset on UTC-day
 * rollover. Deliberately approximate — they exist to cap worst-case daily
 * volume (e.g. Resend's free-tier quota), not to be a precise distributed
 * quota. Same pattern as checkDailyCap in chat-limits.ts, generalized. */
const dailyCounters = new Map<string, DailyCounter>();

/**
 * Global (not per-key) daily cap. Returns true (and consumes one slot)
 * while today's usage of `name` is under `limit`; false once the cap is
 * hit. The counter resets when the UTC day of `now` changes.
 *
 * @param name  Counter identifier, e.g. "contact".
 * @param limit Maximum allowed uses per UTC day.
 * @param now   Clock injection point for tests; defaults to Date.now().
 */
export function dailyCap(
  name: string,
  limit: number,
  now: number = Date.now(),
): boolean {
  const utcDay = Math.floor(now / MS_PER_UTC_DAY);
  const counter = dailyCounters.get(name);
  const used = counter && counter.utcDay === utcDay ? counter.used : 0;

  if (used >= limit) {
    return false;
  }

  dailyCounters.set(name, { utcDay, used: used + 1 });
  return true;
}

/** Clear all daily counters — test helper only. */
export function resetDailyCaps(): void {
  dailyCounters.clear();
}

/**
 * Strip CR/LF and other control characters so user input can't smuggle
 * extra headers into an email subject (header injection), then collapse
 * runs of whitespace. Lives here (not in the route file) so it stays
 * unit-testable — Next.js route modules can't export extra symbols.
 */
export function sanitizeHeaderText(value: string): string {
  return (
    value
      // eslint-disable-next-line no-control-regex
      .replace(/[\r\n\t\x00-\x1f\x7f]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}
