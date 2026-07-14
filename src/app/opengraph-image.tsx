import { ImageResponse } from "next/og";

export const alt = "Aaron Chai — Ecommerce Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The OG renderer runs outside the DOM and cannot read CSS custom properties,
// so the locked design-token values are inlined here (the one allowed
// exception) — they mirror --ink/--bone/--muted/--current-1/--current-2
// in globals.css exactly.
const PORCELAIN = "#FBF7F4";
const PLUM = "#2A1E2F";
const MUTED = "#7A6470";
const LACQUER = "#D93664";
const ROUGE = "#8E2043";
const GILT = "#B98A2F";

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
          backgroundColor: PORCELAIN,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            flexGrow: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 26,
              color: MUTED,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50% 46% 52% 48%",
                backgroundImage: `linear-gradient(135deg, ${LACQUER}, ${ROUGE})`,
              }}
            />
            Shade 050 · Portfolio
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "48% 52% 46% 50%",
                backgroundImage: `linear-gradient(135deg, ${GILT}, #8A5F14)`,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 130,
              fontWeight: 700,
              color: PLUM,
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
            }}
          >
            Aaron Chai
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 46,
              fontWeight: 400,
              color: ROUGE,
            }}
          >
            Ecommerce Developer
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
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
