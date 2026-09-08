import { profile } from "@/content/profile";
import { ThemeToggle } from "@/components/nav/ThemeToggle";

const ANCHOR_LINKS = [
  { label: "Index", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("");
}

/** Persistent editorial masthead with direct access to every key chapter. */
export function SiteNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/95 backdrop-blur-sm"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
      >
        Skip to content
      </a>

      <div className="mx-auto grid min-h-16 w-full max-w-[96rem] grid-cols-[1fr_auto] items-center px-4 sm:px-8 lg:grid-cols-[16rem_1fr_auto] lg:px-12">
        <a
          href="#"
          className="flex min-h-11 items-center font-mono text-xs font-semibold uppercase tracking-[0.18em] text-bone transition-colors duration-(--dur) hover:text-signal"
        >
          {initialsOf(profile.name)}
          <span className="hidden sm:inline"> / Portfolio 2026</span>
        </a>

        <div className="contents">
          <ul className="hidden items-center gap-7 lg:flex">
            {ANCHOR_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors duration-(--dur) hover:text-signal"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex self-stretch">
            <ThemeToggle />
            <a
              href={profile.resumePdf}
              download
              className="inline-flex min-h-12 items-center border-l border-line bg-current-2 px-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-on-current-2 transition-colors duration-(--dur) hover:bg-signal hover:text-on-signal sm:px-5"
            >
              Resume
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
