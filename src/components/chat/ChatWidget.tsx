"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

/* Loaded on first open so the panel's code stays out of the root layout
 * chunk — the widget ships on every page, the panel only when used. */
const ChatPanel = dynamic(
  () => import("./ChatPanel").then((mod) => mod.ChatPanel),
  { ssr: false },
);

/**
 * Floating "Ask my resume" trigger, fixed bottom-right. Opens the ChatPanel
 * on click or when anything on the page dispatches the `open-chat`
 * CustomEvent (the AiShowcase teaser does). When the panel closes, focus
 * returns to whatever opened it.
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  const open = useCallback(() => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("open-chat", open);
    return () => window.removeEventListener("open-chat", open);
  }, [open]);

  /* Focus restore runs after the close re-render, when the trigger button
   * is mounted again. If the original opener is gone (or was the trigger,
   * which unmounts while the panel is open), fall back to the trigger. */
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      return;
    }
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    const opener = returnFocusRef.current;
    const target = opener?.isConnected ? opener : triggerRef.current;
    target?.focus();
  }, [isOpen]);

  if (isOpen) {
    return <ChatPanel onClose={close} />;
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={open}
      className="fixed right-4 bottom-4 z-50 min-h-11 cursor-pointer rounded-full border border-line bg-surface px-5 font-mono text-sm text-bone transition-colors duration-(--dur) hover:border-current-1 focus-visible:border-current-1"
    >
      Ask my resume
    </button>
  );
}
