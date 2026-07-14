import { ImageResponse } from "next/og";

export const alt = "Aaron Chai — Frontend Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The OG renderer runs outside the DOM and cannot read CSS custom properties,
// so the locked design-token values are inlined here (the one allowed
// exception) — they mirror the tokens in globals.css exactly.
const WARM_WHITE = "#FFF9F0";
const INDIGO = "#221C4E";
const DUSK = "#625D86";
const GOLDEN = "#FFC532";
const CORAL = "#FF3D71";
const TANGERINE = "#FF7A29";
const SKY = "#7AC7FF";

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
          backgroundColor: WARM_WHITE,
          backgroundImage: `radial-gradient(500px 280px at 85% -40px, ${GOLDEN}44, transparent 70%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: DUSK,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              backgroundColor: GOLDEN,
              border: `4px solid ${TANGERINE}`,
            }}
          />
          Chino Hills, CA — golden hour
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 132,
              fontWeight: 800,
              color: INDIGO,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
            }}
          >
            Aaron Chai
          </div>
          <div
            style={{
              marginTop: 30,
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 48,
              fontWeight: 700,
              color: INDIGO,
            }}
          >
            <span
              style={{
                backgroundColor: GOLDEN,
                padding: "2px 18px",
                borderRadius: 14,
                transform: "rotate(-1deg)",
              }}
            >
              Frontend
            </span>
            Developer
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: DUSK,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          <span>aaronchai.dev</span>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: GOLDEN }} />
            <div style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: SKY }} />
            <div style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: CORAL }} />
            <div style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: TANGERINE }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
