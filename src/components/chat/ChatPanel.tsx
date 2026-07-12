"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Role = "user" | "assistant";

interface ChatMessage {
  role: Role;
  content: string;
  /** Fallback/error messages get an explicit resume-PDF link appended. */
  withPdfLink?: boolean;
}

const RESUME_PDF = "/resume/Aaron_Chai_Resume.pdf";

const SUGGESTED_QUESTIONS = [
  "What did Aaron build at Beauty 21?",
  "What's his backend experience?",
  "How does he use AI tooling?",
];

const ERROR_COPY =
  "Something hiccuped on my end — try again in a moment, or grab the resume PDF.";

/* API contract mirrors chatRequestSchema: <=20 messages, each 1-1000 chars. */
const MAX_HISTORY = 20;
const MAX_MESSAGE_CHARS = 1000;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function toPayload(history: ChatMessage[]): { role: Role; content: string }[] {
  return history
    .filter((m) => m.content.trim().length > 0)
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
}

/**
 * Slide-up chat panel: focus-trapped dialog with a streaming message list.
 * Talks to POST /api/chat — a JSON body means a friendly fallback (rate
 * limit / missing key / daily cap); anything else is a plain-text stream
 * of deltas appended live to the last assistant message.
 */
export function ChatPanel({ onClose }: { onClose: () => void }) {
  const reducedMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Enter transition: paint one hidden frame, then flip to visible.
   * Double rAF guarantees the browser commits the initial state first. */
  useEffect(() => {
    if (reducedMotion) {
      setEntered(true);
      return;
    }
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [reducedMotion]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  /* Keep the newest message in view as deltas stream in. */
  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [messages]);

  const appendOrReplaceAssistant = useCallback(
    (content: string, withPdfLink: boolean) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        const next: ChatMessage = { role: "assistant", content, withPdfLink };
        if (last?.role === "assistant" && last.content === "") {
          return [...prev.slice(0, -1), next];
        }
        return [...prev, next];
      });
    },
    [],
  );

  const send = useCallback(
    async (raw: string) => {
      const content = raw.trim().slice(0, MAX_MESSAGE_CHARS);
      if (!content || isStreaming) return;

      const history = [...messages, { role: "user" as const, content }];
      setMessages(history);
      setInput("");
      setIsStreaming(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: toPayload(history) }),
        });

        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const data = (await response.json()) as {
            fallback?: string;
            error?: string;
          };
          appendOrReplaceAssistant(data.fallback ?? ERROR_COPY, true);
          return;
        }

        if (!response.ok || !response.body) {
          throw new Error(`Chat API responded ${response.status}`);
        }

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== "assistant") return prev;
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + chunk },
            ];
          });
        }
      } catch {
        appendOrReplaceAssistant(ERROR_COPY, true);
      } finally {
        setIsStreaming(false);
        textareaRef.current?.focus();
      }
    },
    [appendOrReplaceAssistant, isStreaming, messages],
  );

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  }

  const motionClasses = reducedMotion
    ? ""
    : "transition-[transform,opacity] duration-(--dur) ease-(--ease-out-expo)";
  const stateClasses = entered
    ? "translate-y-0 opacity-100"
    : "translate-y-4 opacity-0";

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-panel-title"
      onKeyDown={handlePanelKeyDown}
      className={`fixed right-4 bottom-4 z-50 flex h-[min(70vh,32rem)] w-[min(92vw,26rem)] flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-2xl ${motionClasses} ${stateClasses}`}
    >
      <header className="flex items-center justify-between border-b border-line pl-4">
        <h2
          id="chat-panel-title"
          className="font-mono text-xs tracking-[0.2em] text-bone uppercase"
        >
          Ask my resume
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg text-muted transition-colors duration-(--dur) hover:text-bone"
        >
          &times;
        </button>
      </header>

      <div
        ref={listRef}
        aria-live="polite"
        role="log"
        className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-start gap-2">
            <p className="mb-1 text-sm text-muted">
              Ask about Aaron&apos;s work — answers come straight from his
              resume.
            </p>
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => void send(question)}
                className="min-h-11 cursor-pointer rounded-full border border-line px-4 py-2 text-left font-mono text-xs text-bone transition-colors duration-(--dur) hover:border-current-1"
              >
                {question}
              </button>
            ))}
          </div>
        ) : (
          messages.map((message, index) =>
            message.role === "user" ? (
              <p
                key={index}
                className="max-w-[85%] self-end rounded-lg border border-line bg-ink px-3 py-2 text-sm whitespace-pre-wrap text-bone"
              >
                {message.content}
              </p>
            ) : (
              <p
                key={index}
                className="max-w-[85%] self-start text-sm whitespace-pre-wrap text-muted"
              >
                {message.content === "" && isStreaming ? (
                  <span
                    aria-label="Thinking"
                    className={reducedMotion ? "" : "animate-pulse"}
                  >
                    &hellip;
                  </span>
                ) : (
                  message.content
                )}
                {message.withPdfLink ? (
                  <>
                    {" "}
                    <a
                      href={RESUME_PDF}
                      className="text-bone underline decoration-line underline-offset-4 transition-colors duration-(--dur) hover:text-current-2"
                    >
                      Download the resume PDF
                    </a>
                  </>
                ) : null}
              </p>
            ),
          )
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send(input);
        }}
        className="flex items-end gap-2 border-t border-line p-3"
      >
        <label htmlFor="chat-input" className="sr-only">
          Your question
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleInputKeyDown}
          rows={2}
          maxLength={MAX_MESSAGE_CHARS}
          placeholder="Ask about Aaron's work..."
          className="min-h-11 flex-1 resize-none rounded-md border border-line bg-ink p-2.5 text-sm text-bone placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={isStreaming}
          className="min-h-11 cursor-pointer rounded-md border border-line px-4 font-mono text-xs text-bone transition-colors duration-(--dur) hover:border-current-1 disabled:cursor-default disabled:opacity-60"
        >
          {isStreaming ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
