/**
 * In-memory sliding-window rate limiter.
 *
 * Suited to a single serverless/Node instance: state lives in a module-level
 * Map and resets on cold start. Good enough for a personal-site contact form;
 * swap for a shared store (Redis/KV) if the site ever runs multi-instance.
 */

const hits = new Map<string, number[]>();

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
  return true;
}

/** Clear all buckets — test helper only. */
export function resetRateLimits(): void {
  hits.clear();
}
