import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { CurrentLine } from "@/components/current/CurrentLine";
import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const grotesk = localFont({
  src: "../../public/fonts/space-grotesk-var.woff2",
  variable: "--font-grotesk",
  display: "swap",
  weight: "300 700",
});

const DESCRIPTION =
  "Full-stack developer building Shopify commerce systems and production LLM tooling with React, TypeScript, Node.js, and Python.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aaron Chai — Full-Stack Developer",
    template: "%s — Aaron Chai",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Aaron Chai",
    url: SITE_URL,
    title: "Aaron Chai — Full-Stack Developer",
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
    <html lang="en" className={grotesk.variable}>
      <body className="bg-ink text-bone">
        {children}
        <CurrentLine />
        <ChatWidget />
        <div className="grain" aria-hidden="true" />
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
