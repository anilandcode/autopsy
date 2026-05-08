import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Autopsy — Forensic Postmortem Intelligence";
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
          backgroundColor: "#0E0E0E",
          padding: "60px",
        }}
      >
        {/* Red accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: "#D62828",
          }}
        />
        {/* Yellow stripe */}
        <div
          style={{
            display: "flex",
            width: "100%",
            padding: "8px 16px",
            backgroundColor: "#FFD60A",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              fontWeight: "bold",
              letterSpacing: "0.1em",
              color: "#000",
            }}
          >
            AUTOPSY / FORENSIC POSTMORTEM INTELLIGENCE
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 140,
            fontWeight: 400,
            color: "#F4F1EA",
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
            color: "#71706B",
            letterSpacing: "0.1em",
            marginTop: "24px",
            textTransform: "uppercase",
          }}
        >
          6 AGENTS &middot; PARALLEL RESEARCH &middot; CROSS-AGENT DEBATE &middot; 1 VERDICT
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#2A2A2A",
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
              color: "#5C5852",
              letterSpacing: "0.1em",
            }}
          >
            AMD MI300X &middot; 192GB HBM3
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "#5C5852",
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
