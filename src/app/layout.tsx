import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { CurrentLine } from "@/components/current/CurrentLine";
import "./globals.css";

const grotesk = localFont({
  src: "../../public/fonts/space-grotesk-var.woff2",
  variable: "--font-grotesk",
  display: "swap",
  weight: "300 700",
});

export const metadata: Metadata = {
  title: "Aaron Chai — Full-Stack Developer",
  description:
    "Full-stack developer shipping production commerce systems: React/TypeScript, Node.js, Python, serverless APIs, and LLM-powered tooling.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body className="bg-ink text-bone">
        {children}
        <CurrentLine />
        <div className="grain" aria-hidden="true" />
        <Analytics />
      </body>
    </html>
  );
}
