import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { GlossBar } from "@/components/current/GlossBar";
import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/* V2 "Shade Card" type pairing: Bodoni Moda carries the editorial display
 * voice; Manrope carries body prose. Both variable, self-hosted, swapped. */
const bodoni = localFont({
  src: [
    {
      path: "../../public/fonts/bodoni-moda-var.woff2",
      style: "normal",
      weight: "400 900",
    },
    {
      path: "../../public/fonts/bodoni-moda-italic-var.woff2",
      style: "italic",
      weight: "400 900",
    },
  ],
  variable: "--font-bodoni",
  display: "swap",
});

const manrope = localFont({
  src: "../../public/fonts/manrope-var.woff2",
  variable: "--font-grotesk",
  display: "swap",
  weight: "200 800",
});

const DESCRIPTION =
  "Ecommerce developer for Shopify Plus storefronts — custom OS 2.0 themes, loyalty programs, B2B portals, and headless React builds across 2,600+ SKUs.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aaron Chai — Ecommerce Developer",
    template: "%s — Aaron Chai",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Aaron Chai",
    url: SITE_URL,
    title: "Aaron Chai — Ecommerce Developer",
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
    <html lang="en" className={`${bodoni.variable} ${manrope.variable}`}>
      <body className="bg-ink text-bone">
        {children}
        <GlossBar />
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
