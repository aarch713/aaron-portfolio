import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { StatusBar } from "@/components/current/StatusBar";
import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/* V3 "Console" type pairing: JetBrains Mono carries display, labels, and
 * data; IBM Plex Sans carries body prose. Both variable, self-hosted. */
const jbMono = localFont({
  src: "../../public/fonts/jetbrains-mono-var.woff2",
  variable: "--font-jbmono",
  display: "swap",
  weight: "100 800",
});

const plexSans = localFont({
  src: "../../public/fonts/ibm-plex-sans-var.woff2",
  variable: "--font-grotesk",
  display: "swap",
  weight: "100 700",
});

const DESCRIPTION =
  "Software engineer building distributed commerce systems — serverless API gateways, idempotent transaction ledgers, and production LLM tooling in TypeScript, Node.js, and Python.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aaron Chai — Software Engineer",
    template: "%s — Aaron Chai",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Aaron Chai",
    url: SITE_URL,
    title: "Aaron Chai — Software Engineer",
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
    <html lang="en" className={`${jbMono.variable} ${plexSans.variable}`}>
      <body className="bg-ink text-bone">
        {children}
        <StatusBar />
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
