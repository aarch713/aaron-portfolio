import type { Metadata } from "next";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "Not found — Aaron Chai",
  description: "That page doesn't exist.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
        404
      </p>
      <h1
        className="mt-6 font-medium leading-[1.05] tracking-tight text-bone"
        style={{ fontSize: "var(--text-h2)" }}
      >
        Lost pixel.
      </h1>
      <p className="mt-4 text-xl text-muted">That page doesn&rsquo;t exist.</p>
      <div className="mt-10">
        <MagneticButton href="/" variant="ghost">
          Back home
        </MagneticButton>
      </div>
    </main>
  );
}
