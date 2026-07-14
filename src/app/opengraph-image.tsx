import { ImageResponse } from "next/og";

export const alt = "Aaron Chai — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The OG renderer runs outside the DOM and cannot read CSS custom properties,
// so the locked design-token values are inlined here (the one allowed
// exception) — they mirror --ink/--surface/--line/--bone/--muted/--current-1/2
// in globals.css exactly.
const INK = "#0A0F0C";
const PANEL = "#101812";
const LINE = "#1F2D23";
const FOG = "#C9D6CD";
const DIM = "#6D7F72";
const PHOSPHOR = "#4AF2A1";
const AMBER = "#FFB454";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: INK,
          padding: "60px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: PANEL,
            border: `2px solid ${LINE}`,
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "22px 32px",
              borderBottom: `2px solid ${LINE}`,
              color: DIM,
              fontSize: 26,
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: AMBER }} />
            <div style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: PHOSPHOR }} />
            <div style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: LINE }} />
            <div style={{ marginLeft: 14 }}>aaron@chai:~/portfolio</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexGrow: 1,
              padding: "0 64px",
            }}
          >
            <div style={{ display: "flex", fontSize: 30, color: DIM }}>
              <span style={{ color: PHOSPHOR }}>$&nbsp;</span> whoami
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 110,
                fontWeight: 700,
                color: FOG,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                display: "flex",
              }}
            >
              AARON CHAI
              <span style={{ color: PHOSPHOR }}>▊</span>
            </div>
            <div style={{ marginTop: 20, display: "flex", fontSize: 42, color: FOG }}>
              <span style={{ color: PHOSPHOR }}>&gt;&nbsp;</span> Software Engineer
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "20px 32px",
              borderTop: `2px solid ${LINE}`,
              color: DIM,
              fontSize: 24,
              letterSpacing: "0.1em",
            }}
          >
            <span>aaronchai.dev</span>
            <span style={{ color: AMBER }}>scroll 000%</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
