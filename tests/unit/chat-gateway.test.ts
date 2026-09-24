/* The /api/chat route talks to Vercel AI Gateway over the Anthropic Messages
 * format. Nothing here touches the network: the SDK is mocked, so these tests
 * assert the three things the migration actually moved — the host, the
 * credential and the model slug — plus the streaming path that must not have
 * changed with them. */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetDailyCap } from "../../src/lib/chat-limits";

const mocks = vi.hoisted(() => ({
  constructed: [] as unknown[],
  streamCalls: [] as Record<string, unknown>[],
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = {
      stream: (args: Record<string, unknown>) => {
        mocks.streamCalls.push(args);
        return textStream("Aaron builds commerce systems.");
      },
    };
    constructor(options: unknown) {
      mocks.constructed.push(options);
    }
  },
}));

/* Minimal stand-in for the SDK's MessageStream: one text delta, then done. */
function textStream(text: string) {
  return {
    abort: vi.fn(),
    [Symbol.asyncIterator]() {
      let sent = false;
      return {
        async next() {
          if (sent) return { done: true as const, value: undefined };
          sent = true;
          return {
            done: false as const,
            value: {
              type: "content_block_delta",
              delta: { type: "text_delta", text },
            },
          };
        },
      };
    },
  };
}

let seq = 0;
const post = async () => {
  const { POST } = await import("../../src/app/api/chat/route");
  /* A fresh IP per call: the route's own rate limiter is real here. */
  return POST(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `10.0.0.${++seq}`,
      },
      body: JSON.stringify({ messages: [{ role: "user", content: "What has Aaron built?" }] }),
    }),
  );
};

describe("/api/chat through AI Gateway", () => {
  beforeEach(() => {
    mocks.constructed.length = 0;
    mocks.streamCalls.length = 0;
    resetDailyCap();
    vi.unstubAllEnvs();
  });

  it("points the Anthropic client at the gateway host with the gateway key", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-gateway-key");

    await post();

    expect(mocks.constructed).toHaveLength(1);
    expect(mocks.constructed[0]).toEqual({
      baseURL: "https://ai-gateway.vercel.sh",
      apiKey: "test-gateway-key",
    });
  });

  it("sends the gateway's creator/model slug, not a provider-native model ID", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-gateway-key");

    await post();

    expect(mocks.streamCalls[0].model).toBe("anthropic/claude-haiku-4.5");
  });

  it("still streams text deltas to the client unchanged", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-gateway-key");

    const response = await post();

    expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await response.text()).toBe("Aaron builds commerce systems.");
  });

  it("falls back without calling the gateway when the gateway key is absent", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    /* The retired provider key must not revive the chat. */
    vi.stubEnv("ANTHROPIC_API_KEY", "an-old-provider-key");

    const response = await post();

    expect(mocks.constructed).toHaveLength(0);
    expect(await response.json()).toEqual({
      fallback:
        "Chat is resting — grab the resume PDF at /resume/Aaron_Chai_Resume.pdf instead.",
    });
  });
});
