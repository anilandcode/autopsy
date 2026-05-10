import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Autopsy — Forensic Intelligence. Postmortems, Pre-Mortems & Counterfactuals.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0F1110",
          padding: "60px",
        }}
      >
        {/* Indigo accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: "#4B4BA0",
          }}
        />
        {/* Indigo stripe */}
        <div
          style={{
            display: "flex",
            width: "100%",
            padding: "8px 16px",
            backgroundColor: "#4B4BA0",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              fontWeight: "bold",
              letterSpacing: "0.1em",
              color: "#fff",
            }}
          >
            AUTOPSY / FORENSIC INTELLIGENCE / 4 MODES / 24 AGENTS
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 140,
            fontWeight: 400,
            color: "#FFFFFF",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          AUTOPSY
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 18,
            color: "#A1A1AA",
            letterSpacing: "0.1em",
            marginTop: "24px",
            textTransform: "uppercase",
          }}
        >
          4 MODES &middot; 24 AGENTS &middot; PARALLEL RESEARCH &middot; 1 VERDICT
        </div>

        {/* Mode chips */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#4B4BA0", letterSpacing: "0.05em" }}>POSTMORTEM</span>
          <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#8F47AE", letterSpacing: "0.05em" }}>PRE-MORTEM</span>
          <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#00A67E", letterSpacing: "0.05em" }}>FOUNDER</span>
          <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#8F47AE", letterSpacing: "0.05em" }}>COUNTERFACTUAL</span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.05)",
            marginTop: "32px",
            marginBottom: "24px",
          }}
        />

        {/* Bottom metadata */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "#A1A1AA",
              letterSpacing: "0.1em",
            }}
          >
            AMD MI300X &middot; 192GB HBM3
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "#A1A1AA",
              letterSpacing: "0.1em",
            }}
          >
            AMD DEVELOPER HACKATHON 2026
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
