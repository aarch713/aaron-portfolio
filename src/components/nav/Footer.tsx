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

/**
 * Site footer: contact links repeated from the profile, a source-code note,
 * and small print. Server component — no motion, quiet hairline structure.
 */
export function Footer() {
  return (
    <footer className="mb-8 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-20">
        <ul className="grid gap-10 sm:grid-cols-3">
          {CONTACT_LINKS.map((link) => (
            <li key={link.label}>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                {link.label}
              </p>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="mt-2 inline-block font-mono text-sm text-bone underline-offset-4 transition-colors duration-(--dur) hover:text-muted hover:underline"
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Built with Next.js + GSAP —{" "}
            <a
              href={SOURCE_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone underline decoration-line underline-offset-4 transition-colors duration-(--dur) hover:text-muted"
            >
              view source on GitHub
            </a>
          </p>
          <p className="font-mono text-xs text-muted">
            © {COPYRIGHT_YEAR} {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
