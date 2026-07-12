import { beforeEach, describe, expect, it } from "vitest";
import { contactSchema } from "../../src/lib/validation";
import { rateLimit, resetRateLimits } from "../../src/lib/rate-limit";

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
});
