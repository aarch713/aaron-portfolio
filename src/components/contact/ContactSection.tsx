import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";

const HEADING_ID = "contact-heading";

const LINK_CLASSES =
  "inline-flex items-center gap-2 text-bone transition-colors duration-(--dur) hover:text-current-2";

/**
 * Contact section: quiet two-column close — a short invitation plus mono
 * contact links on the left, the form on the right. Entrances are handled by
 * Reveal (static-visible under reduced motion / no JS).
 */
export function ContactSection() {
  const links = [
    { label: profile.email, href: `mailto:${profile.email}`, external: false },
    { label: "LinkedIn", href: profile.linkedin, external: true },
    { label: "GitHub", href: profile.github, external: true },
  ];

  return (
    <section
      id="contact"
      aria-labelledby={HEADING_ID}
      className="py-(--space-section)"
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <SectionHeading eyebrow="RFI-001" title="Request for information" id={HEADING_ID} />

        <div className="mt-14 grid items-start gap-14 lg:mt-20 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="max-w-md text-lg leading-relaxed text-muted">
              Hiring, or just curious? My inbox is open.
            </p>
            <ul className="mt-10 space-y-4 font-mono text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={LINK_CLASSES}
                  >
                    {link.label}
                    {link.external ? <span aria-hidden="true">↗</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
