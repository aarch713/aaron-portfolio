import { profile } from "@/content/profile";

const SOURCE_REPO_URL = "https://github.com/aarch713/aaron-portfolio";
const COPYRIGHT_YEAR = 2026;

/** Strips the protocol so links read as plain addresses. */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

const CONTACT_LINKS = [
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    text: profile.email,
    external: false,
  },
  {
    label: "LinkedIn",
    href: profile.linkedin,
    text: displayUrl(profile.linkedin),
    external: true,
  },
  {
    label: "GitHub",
    href: profile.github,
    text: displayUrl(profile.github),
    external: true,
  },
];

const LINK_CLASSES =
  "mt-2 inline-block font-mono text-sm text-bone underline-offset-4 transition-colors duration-(--dur) hover:text-current-2 hover:underline";

/**
 * Site footer as a drawing title block: a bordered grid of labeled fields —
 * contact routes, project, revision — exactly like the stamp corner of a
 * plotted sheet. Server component, no motion.
 */
export function Footer() {
  return (
    <footer className="px-6 pb-10 pt-4 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-6xl border border-line">
        <p className="border-b border-line px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.25em] text-muted">
          Title block
        </p>

        <div className="grid sm:grid-cols-3">
          {CONTACT_LINKS.map((link, index) => (
            <div
              key={link.label}
              className={`px-5 py-4 ${index > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""}`}
            >
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-muted">
                {link.label}
              </p>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={LINK_CLASSES}
              >
                {link.text}
              </a>
            </div>
          ))}
        </div>

        <div className="grid border-t border-line sm:grid-cols-3">
          <div className="px-5 py-4">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-muted">
              Drawn by
            </p>
            <p className="mt-2 font-mono text-sm text-bone">{profile.name}</p>
          </div>
          <div className="border-t border-line px-5 py-4 sm:border-l sm:border-t-0">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-muted">
              Source
            </p>
            <a
              href={SOURCE_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASSES}
            >
              view source on GitHub
            </a>
          </div>
          <div className="border-t border-line px-5 py-4 sm:border-l sm:border-t-0">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-muted">
              Revision
            </p>
            <p className="mt-2 font-mono text-sm text-bone">
              © {COPYRIGHT_YEAR} · Next.js + GSAP
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
