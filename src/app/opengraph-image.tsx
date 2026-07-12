import { ImageResponse } from "next/og";

export const alt = "Aaron Chai — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The OG renderer runs outside the DOM and cannot read CSS custom properties,
// so the locked design-token values are inlined here (the one allowed
// exception) — they mirror --ink/--bone/--muted/--current-1/--current-2
// in globals.css exactly.
const INK = "#0B0B10";
const BONE = "#F2EFE9";
const MUTED = "#8A8AA0";
const CURRENT_1 = "#7C5CFF";
const CURRENT_2 = "#3EE6FF";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: INK,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <div
            style={{
              fontSize: 130,
              fontWeight: 700,
              color: BONE,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Aaron Chai
          </div>
          <div
            style={{
              width: 240,
              height: 8,
              marginTop: 36,
              borderRadius: 4,
              backgroundImage: `linear-gradient(90deg, ${CURRENT_1}, ${CURRENT_2})`,
            }}
          />
          <div
            style={{
              marginTop: 30,
              fontSize: 46,
              fontWeight: 400,
              color: BONE,
              letterSpacing: "-0.01em",
            }}
          >
            Full-Stack Developer
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            color: MUTED,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          aaronchai.dev
        </div>
      </div>
    ),
    size,
  );
}
