"use client";

import Link from "next/link";
import { profile } from "@/content/profile";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Must match the event name the chat widget listens for (plan Tasks 9 + 14). */
const OPEN_CHAT_EVENT = "open-chat";
/** Keyword that locates the AI sentence inside profile.summary. */
const INTRO_KEYWORD = "LLM";
/** Per-tile reveal stagger (seconds). */
const TILE_STAGGER = 0.1;

interface AiTile {
  title: string;
  tagline?: string;
  body: string;
  tags?: string[];
  link?: { href: string; label: string };
}

/**
 * Trimmed shape of the Paperclip case study, passed down from the server
 * page so this client component doesn't pull the whole content layer into
 * the bundle.
 */
export interface PaperclipTileData {
  title: string;
  tagline: string;
  summary: string;
  slug: string;
  stack: string[];
}

/**
 * Pulls the AI sentence out of the profile summary so the intro stays sourced
 * from content. Falls back to the full summary if the sentence ever moves.
 */
function introFromSummary(summary: string): string {
  const sentence = summary
    .split(". ")
    .find((candidate) => candidate.includes(INTRO_KEYWORD));
  if (!sentence) return summary;
  return sentence.endsWith(".") ? sentence : `${sentence}.`;
}

function buildTiles(paperclip: PaperclipTileData): AiTile[] {
  return [
    {
      title: "LLM & GenAI integration",
      body: "Claude API integration with prompt engineering and grounded generation — responses constrained to real source data instead of model guesses. The resume chat on this page runs the same way.",
    },
    {
      title: "Agentic tooling",
      body: "Claude Code and MCP automation inside the daily production workflow — agents act on real systems through typed tool interfaces, and humans handle the exceptions.",
    },
    {
      title: paperclip.title,
      tagline: paperclip.tagline,
      body: paperclip.summary,
      tags: paperclip.stack,
      link: {
        href: `/projects/${paperclip.slug}`,
        label: "Read the case study",
      },
    },
  ];
}

const INTRO = introFromSummary(profile.summary);

function handleOpenChat(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT));
}

/**
 * AI showcase — three quiet tiles (LLM integration, agentic tooling, and the
 * Paperclip B21 case study) plus an inline teaser that opens the resume chat.
 * All motion flows through Reveal / MagneticButton, which are reduced-motion
 * and no-JS safe.
 */
export function AiShowcase({ paperclip }: { paperclip: PaperclipTileData }) {
  const tiles = buildTiles(paperclip);

  return (
    <section
      id="ai"
      aria-labelledby="ai-heading"
      className="px-6 py-(--space-section) md:px-10 lg:px-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="ai-heading"
          eyebrow="AI, daily"
          title="AI in the daily flow"
        />

        <Reveal delay={0.05}>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted">{INTRO}</p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3 lg:gap-6">
          {tiles.map((tile, index) => (
            <Reveal
              key={tile.title}
              delay={index * TILE_STAGGER}
              className="h-full"
            >
              <article className="flex h-full flex-col border border-line bg-surface p-6 transition-colors duration-(--dur) hover:border-current-1 focus-within:border-current-1 lg:p-8">
                <p aria-hidden="true" className="font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-lg font-medium tracking-tight text-bone md:text-xl">
                  {tile.title}
                </h3>
                {tile.tagline ? (
                  <p className="mt-2 text-sm leading-relaxed text-bone/80">
                    {tile.tagline}
                  </p>
                ) : null}
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {tile.body}
                </p>
                {tile.tags ? (
                  <p className="mt-auto pt-6 font-mono text-xs leading-relaxed text-muted">
                    {tile.tags.join(" · ")}
                  </p>
                ) : null}
                {tile.link ? (
                  <Link
                    href={tile.link.href}
                    className="mt-4 inline-flex items-center gap-2 self-start font-mono text-xs tracking-[0.2em] text-bone uppercase transition-colors duration-(--dur) hover:text-current-2"
                  >
                    {tile.link.label}
                    <span className="sr-only"> — {tile.title}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-8">
            <p className="font-mono text-sm text-muted">
              Ask my resume anything —
            </p>
            <MagneticButton variant="ghost" onClick={handleOpenChat}>
              Open chat
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
