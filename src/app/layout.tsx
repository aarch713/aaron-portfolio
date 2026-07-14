import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { SunArc } from "@/components/current/SunArc";
import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/* V5 "Golden Hour" type pairing: Bricolage Grotesque carries the chunky,
 * warm display voice; Inter carries body prose. Both variable, self-hosted. */
const bricolage = localFont({
  src: "../../public/fonts/bricolage-var.woff2",
  variable: "--font-bricolage",
  display: "swap",
  weight: "200 800",
});

const inter = localFont({
  src: "../../public/fonts/inter-var.woff2",
  variable: "--font-grotesk",
  display: "swap",
  weight: "100 900",
});

const DESCRIPTION =
  "Frontend developer making commerce feel fast — design systems, accessible React/TypeScript UI, and Core Web Vitals wins across two live storefronts.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aaron Chai — Frontend Developer",
    template: "%s — Aaron Chai",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Aaron Chai",
    url: SITE_URL,
    title: "Aaron Chai — Frontend Developer",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  // No alternates here: canonical URLs are defined per page. A layout-level
  // canonical would be inherited by every child route and point them all at
  // the home page.
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chino Hills",
    addressRegion: "CA",
  },
  sameAs: [profile.linkedin, profile.github],
  alumniOf: ["Georgia Institute of Technology", "San Diego State University"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body className="bg-ink text-bone">
        {children}
        <SunArc />
        <ChatWidget />
        <script
          type="application/ld+json"
          // Static, locally-defined literal serialized via JSON.stringify —
          // no user input reaches this markup.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
