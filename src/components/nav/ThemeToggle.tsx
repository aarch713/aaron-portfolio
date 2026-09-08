"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "portfolio-theme";
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";
const THEME_TRANSITION_MS = 500;

function systemTheme(): Theme {
  return window.matchMedia(DARK_MODE_QUERY).matches ? "dark" : "light";
}

function activeTheme(): Theme {
  const explicitTheme = document.documentElement.dataset.theme;
  return explicitTheme === "light" || explicitTheme === "dark"
    ? explicitTheme
    : systemTheme();
}

/** Header control that follows the OS until the visitor makes a choice. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  const beginThemeTransition = () => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove("theme-transition");
      transitionTimeoutRef.current = null;
    }, THEME_TRANSITION_MS);
  };

  useEffect(() => {
    const media = window.matchMedia(DARK_MODE_QUERY);
    const syncTheme = () => setTheme(activeTheme());
    const handleSystemChange = () => {
      if (!document.documentElement.dataset.theme) beginThemeTransition();
      syncTheme();
    };

    syncTheme();
    media.addEventListener("change", handleSystemChange);
    return () => {
      media.removeEventListener("change", handleSystemChange);
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      document.documentElement.classList.remove("theme-transition");
    };
  }, []);

  const nextTheme = theme === "light" ? "dark" : "light";
  const label = theme ? `Switch to ${nextTheme} theme` : "Toggle color theme";

  const handleToggle = () => {
    const next = activeTheme() === "light" ? "dark" : "light";
    beginThemeTransition();
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Theme switching still works when storage is unavailable.
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label}
      title={label}
      className="inline-flex min-h-12 min-w-12 cursor-pointer items-center justify-center border-l border-line bg-ink text-bone transition-colors duration-(--dur) hover:bg-signal hover:text-on-signal"
    >
      {theme === "light" ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}
