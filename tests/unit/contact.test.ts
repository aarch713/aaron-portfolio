import { beforeEach, describe, expect, it } from "vitest";
import { contactSchema } from "../../src/lib/validation";
import {
  dailyCap,
  MAX_RATE_LIMIT_KEYS,
  rateLimit,
  resetDailyCaps,
  resetRateLimits,
  sanitizeHeaderText,
} from "../../src/lib/rate-limit";

const validPayload = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hello Aaron, I would like to talk about a role.",
  company: "",
  startedAt: 1_752_300_000_000,
};

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    const result = contactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects a filled honeypot (company)", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      company: "Acme Bots Inc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      message: "too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message longer than 4000 characters", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      message: "x".repeat(4001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed email", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty name", () => {
    const result = contactSchema.safeParse({ ...validPayload, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing startedAt", () => {
    const { startedAt: _startedAt, ...withoutStartedAt } = validPayload;
    const result = contactSchema.safeParse(withoutStartedAt);
    expect(result.success).toBe(false);
  });
});

describe("rateLimit", () => {
  const WINDOW_MS = 60_000;
  const MAX = 3;
  const T0 = 1_000_000;

  beforeEach(() => {
    resetRateLimits();
  });

  it("allows up to max requests within the window", () => {
    expect(rateLimit("k", MAX, WINDOW_MS, T0)).toBe(true);
    expect(rateLimit("k", MAX, WINDOW_MS, T0 + 1)).toBe(true);
    expect(rateLimit("k", MAX, WINDOW_MS, T0 + 2)).toBe(true);
  });

  it("blocks the request after max is reached", () => {
    for (let i = 0; i < MAX; i += 1) {
      expect(rateLimit("k", MAX, WINDOW_MS, T0 + i)).toBe(true);
    }
    expect(rateLimit("k", MAX, WINDOW_MS, T0 + MAX)).toBe(false);
  });

  it("frees the key once the window expires", () => {
    for (let i = 0; i < MAX; i += 1) {
      rateLimit("k", MAX, WINDOW_MS, T0 + i);
    }
    expect(rateLimit("k", MAX, WINDOW_MS, T0 + MAX)).toBe(false);
    expect(rateLimit("k", MAX, WINDOW_MS, T0 + WINDOW_MS + 1)).toBe(true);
  });

  it("tracks keys independently", () => {
    for (let i = 0; i < MAX; i += 1) {
      rateLimit("a", MAX, WINDOW_MS, T0 + i);
    }
    expect(rateLimit("a", MAX, WINDOW_MS, T0 + MAX)).toBe(false);
    expect(rateLimit("b", MAX, WINDOW_MS, T0 + MAX)).toBe(true);
  });

  it("only prunes timestamps outside the window", () => {
    rateLimit("k", MAX, WINDOW_MS, T0);
    rateLimit("k", MAX, WINDOW_MS, T0 + WINDOW_MS - 1);
    rateLimit("k", MAX, WINDOW_MS, T0 + WINDOW_MS - 1);
    // T0 has expired at T0 + WINDOW_MS + 1, but the two later hits remain.
    expect(rateLimit("k", MAX, WINDOW_MS, T0 + WINDOW_MS + 1)).toBe(true);
    // Now three live timestamps again — blocked.
    expect(rateLimit("k", MAX, WINDOW_MS, T0 + WINDOW_MS + 2)).toBe(false);
  });

  it("evicts the oldest-inserted keys once the key cap is exceeded", () => {
    // Fill the oldest key so its bucket is observably "full".
    expect(rateLimit("oldest", 1, WINDOW_MS, T0)).toBe(true);
    expect(rateLimit("oldest", 1, WINDOW_MS, T0 + 1)).toBe(false);

    // Insert enough distinct keys to push the Map past the cap.
    for (let i = 0; i < MAX_RATE_LIMIT_KEYS; i += 1) {
      rateLimit(`attacker-${i}`, 1, WINDOW_MS, T0 + 2);
    }

    // "oldest" was evicted — a fresh bucket allows the hit again.
    expect(rateLimit("oldest", 1, WINDOW_MS, T0 + 3)).toBe(true);
    // A recently inserted key kept its state — still blocked.
    expect(
      rateLimit(`attacker-${MAX_RATE_LIMIT_KEYS - 1}`, 1, WINDOW_MS, T0 + 3),
    ).toBe(false);
  });
});

describe("dailyCap", () => {
  const NOON_UTC = Date.UTC(2026, 6, 12, 12, 0, 0);

  beforeEach(() => {
    resetDailyCaps();
  });

  it("allows requests up to the limit, then blocks", () => {
    for (let i = 0; i < 3; i += 1) {
      expect(dailyCap("contact", 3, NOON_UTC)).toBe(true);
    }
    expect(dailyCap("contact", 3, NOON_UTC)).toBe(false);
    expect(dailyCap("contact", 3, NOON_UTC)).toBe(false);
  });

  it("keeps blocking within the same UTC day", () => {
    const morning = Date.UTC(2026, 6, 12, 0, 1, 0);
    const night = Date.UTC(2026, 6, 12, 23, 59, 0);
    expect(dailyCap("contact", 2, morning)).toBe(true);
    expect(dailyCap("contact", 2, morning)).toBe(true);
    expect(dailyCap("contact", 2, night)).toBe(false);
  });

  it("resets when the UTC day rolls over", () => {
    const beforeMidnight = Date.UTC(2026, 6, 12, 23, 59, 0);
    const afterMidnight = Date.UTC(2026, 6, 13, 0, 1, 0);
    expect(dailyCap("contact", 1, beforeMidnight)).toBe(true);
    expect(dailyCap("contact", 1, beforeMidnight)).toBe(false);
    expect(dailyCap("contact", 1, afterMidnight)).toBe(true);
  });

  it("tracks named counters independently", () => {
    expect(dailyCap("contact", 1, NOON_UTC)).toBe(true);
    expect(dailyCap("contact", 1, NOON_UTC)).toBe(false);
    expect(dailyCap("other", 1, NOON_UTC)).toBe(true);
  });

  it("resetDailyCaps clears the counters", () => {
    expect(dailyCap("contact", 1, NOON_UTC)).toBe(true);
    expect(dailyCap("contact", 1, NOON_UTC)).toBe(false);
    resetDailyCaps();
    expect(dailyCap("contact", 1, NOON_UTC)).toBe(true);
  });
});

describe("sanitizeHeaderText", () => {
  it("replaces CR/LF header-injection attempts with spaces", () => {
    expect(sanitizeHeaderText("Jane\r\nBcc: evil@example.com")).toBe(
      "Jane Bcc: evil@example.com",
    );
  });

  it("strips other control characters", () => {
    expect(sanitizeHeaderText("Ja\x00ne\tDoe\x1f\x7f")).toBe("Ja ne Doe");
  });

  it("collapses runs of whitespace and trims", () => {
    expect(sanitizeHeaderText("  Jane   \n\n  Doe  ")).toBe("Jane Doe");
  });

  it("leaves ordinary names untouched", () => {
    expect(sanitizeHeaderText("Jane Doe")).toBe("Jane Doe");
  });
});
