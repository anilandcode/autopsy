import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ subject: string }> }
) {
  const { subject } = await params;
  const decodedSubject = decodeURIComponent(subject);
  const cause = new URL(_request.url).searchParams.get("cause") || "Cause of death under investigation";
  const confidence = new URL(_request.url).searchParams.get("confidence") || "—";
  const mode = new URL(_request.url).searchParams.get("mode") || "postmortem";

  const modeLabel =
    mode === "founder"
      ? "FOUNDER MODE — PRE-FAILURE ANALYSIS"
      : mode === "premortem"
        ? "PRE-MORTEM RISK ASSESSMENT"
        : "POSTMORTEM INVESTIGATION";

  const modeColor =
    mode === "founder" ? "#06D6A0" : mode === "premortem" ? "#FFD60A" : "#D62828";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0E0E0E",
          padding: "48px 60px",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: modeColor,
          }}
        />

        {/* Yellow stripe with mode label */}
        <div
          style={{
            display: "flex",
            width: "100%",
            padding: "6px 16px",
            backgroundColor: "#FFD60A",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              fontWeight: "bold",
              letterSpacing: "0.1em",
              color: "#000",
            }}
          >
            AUTOPSY / {modeLabel}
          </span>
        </div>

        {/* Subject name */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 52,
            fontWeight: 400,
            color: "#F4F1EA",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          {decodedSubject}
        </div>

        {/* Primary cause */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            letterSpacing: "0.1em",
            color: modeColor,
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          PRIMARY CAUSE
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 28,
            fontWeight: 400,
            color: "#B8B5AE",
            lineHeight: 1.3,
            marginBottom: "24px",
            maxWidth: "900px",
          }}
        >
          {safeDecode(cause)}
        </div>

        {/* Confidence */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              letterSpacing: "0.1em",
              color: "#71706B",
              textTransform: "uppercase",
            }}
          >
            CONFIDENCE:
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 20,
              fontWeight: "bold",
              color: modeColor,
            }}
          >
            {confidence}%
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #2A2A2A",
            paddingTop: "16px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "#5C5852",
              letterSpacing: "0.1em",
            }}
          >
            AUTOPSY / FORENSIC INTELLIGENCE
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "#5C5852",
              letterSpacing: "0.1em",
            }}
          >
            autopsy-nine.vercel.app
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

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
