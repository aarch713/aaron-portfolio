import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/* V4 "Blueprint" type pairing: Archivo carries display AND body (an
 * engineering grotesque, wide caps for titles, quiet at text sizes);
 * IBM Plex Mono carries annotations, dimensions, and labels. */
const archivo = localFont({
  src: "../../public/fonts/archivo-var.woff2",
  variable: "--font-grotesk",
  display: "swap",
  weight: "100 900",
});

const plexMono = localFont({
  src: [
    {
      path: "../../public/fonts/ibm-plex-mono-400.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../../public/fonts/ibm-plex-mono-500.woff2",
      style: "normal",
      weight: "500",
    },
  ],
  variable: "--font-plexmono",
  display: "swap",
});

const DESCRIPTION =
  "Backend developer drafting reliable commerce systems — API gateways with circuit breakers, idempotent ledgers, and self-healing pipelines in Node.js, TypeScript, and Python.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aaron Chai — Backend Developer",
    template: "%s — Aaron Chai",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Aaron Chai",
    url: SITE_URL,
    title: "Aaron Chai — Backend Developer",
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
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="bg-ink text-bone">
        {children}
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
