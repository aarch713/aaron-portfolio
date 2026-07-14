import { ImageResponse } from "next/og";

export const alt = "Aaron Chai — Backend Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The OG renderer runs outside the DOM and cannot read CSS custom properties,
// so the locked design-token values are inlined here (the one allowed
// exception) — they mirror --ink/--surface/--line/--bone/--muted/--current-1/2
// in globals.css exactly.
const BLUE = "#0F2E64";
const PANEL = "#143776";
const LINE = "#35619F";
const PAPER = "#EAF2FF";
const FADED = "#A7BCE0";
const REDLINE = "#FF6B45";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: BLUE,
          backgroundImage: `linear-gradient(${LINE}33 2px, transparent 2px), linear-gradient(90deg, ${LINE}33 2px, transparent 2px)`,
          backgroundSize: "48px 48px",
          padding: "48px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: PANEL,
            border: `2px solid ${LINE}`,
            padding: "56px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 24,
              color: FADED,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            <span>Project — personal portfolio</span>
            <span>Cover sheet</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 118,
                fontWeight: 800,
                color: PAPER,
                letterSpacing: "0.005em",
                lineHeight: 1.0,
                textTransform: "uppercase",
              }}
            >
              Aaron Chai
            </div>
            <div
              style={{
                marginTop: 28,
                width: 460,
                height: 2,
                backgroundColor: LINE,
                display: "flex",
              }}
            />
            <div
              style={{
                marginTop: 24,
                fontSize: 44,
                fontWeight: 700,
                color: REDLINE,
                textTransform: "uppercase",
              }}
            >
              Backend Developer
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 24,
              color: FADED,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            <span>aaronchai.dev</span>
            <span>Sheet A-01 of 06</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
