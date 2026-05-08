"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileDown, Lightbulb, CheckCircle2, XCircle, Flag, BookOpen } from "lucide-react";
import type { FounderReport } from "@/types/investigation";

interface FounderVerdictV2Props {
  report: FounderReport;
}

function TypewriterText({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="animate-pulse text-[#4A9B7F]">|</span>}
    </span>
  );
}

function ViabilityScoreDisplay({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const filled = Math.round(pct / 10);
  const empty = 10 - filled;
  const color = score > 0.7 ? "#4A9B7F" : score > 0.4 ? "#8B7A3A" : "#B85C38";
  const label = score > 0.7 ? "VIABLE" : score > 0.4 ? "RISKY" : "NOT VIABLE";

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm" style={{ color }}>
        {"█".repeat(filled)}
        {"░".repeat(empty)} {pct}%
      </span>
      <span
        className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {label}
      </span>
    </div>
  );
}

function generateFounderPDF(report: FounderReport) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Founder Mode Report — ${report.ideaName}</title>
<style>
  @page { margin: 1.5cm; size: A4; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #3C3A39; line-height: 1.6; padding: 0; margin: 0; }
  .header { border-bottom: 2px solid #4A9B7F; padding-bottom: 12px; margin-bottom: 24px; }
  .case-label { font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #4A9B7F; }
  h1 { font-size: 24px; font-weight: 700; margin: 8px 0 0; color: #3C3A39; }
  .meta { font-family: ui-monospace, monospace; font-size: 11px; color: #6B6A69; margin-top: 6px; }
  .section { margin-bottom: 20px; }
  .section-title { font-family: ui-monospace, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #4A9B7F; margin-bottom: 8px; }
  ul, ol { padding-left: 18px; margin: 6px 0 0; }
  li { margin-bottom: 4px; font-size: 13px; }
  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #E5E2DD; font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #A0A09E; }
</style>
</head>
<body>
  <div class="header">
    <div class="case-label">Founder Mode Assessment</div>
    <h1>${report.ideaName}</h1>
    <div class="meta">Viability Score: ${Math.round(report.viabilityScore * 100)}% &nbsp;|&nbsp; Generated: ${new Date(report.generatedAt).toLocaleString()}</div>
  </div>

  <div class="section">
    <div class="section-title">Top Failure Modes</div>
    <ul>
      ${report.topFailureModes.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Red Flags</div>
    <ul>
      ${report.redFlags.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Green Flags</div>
    <ul>
      ${report.greenFlags.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Critical Decisions</div>
    <ol>
      ${report.criticalDecisions.map((item) => `<li>${item}</li>`).join("")}
    </ol>
  </div>

  <div class="section">
    <div class="section-title">Founder Homework</div>
    <ol>
      ${report.founderHomework.map((item) => `<li>${item}</li>`).join("")}
    </ol>
  </div>

  <div class="footer">
    AUTOPSY / FOUNDER MODE / 6 AGENTS / STRESS-TEST
  </div>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 300);
}

export function FounderVerdictV2({ report }: FounderVerdictV2Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "linear" }}
      className="mx-auto max-w-5xl"
    >
      <div className="mb-6 flex items-center gap-3">
        <Lightbulb className="h-4 w-4 text-[#4A9B7F]" />
        <h3
          className="font-mono text-lg uppercase tracking-[0.1em] text-[#3C3A39]"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          &sect;03 &mdash; FOUNDER MODE VERDICT
        </h3>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#E5E2DD] bg-white p-6 sm:p-8">
        {/* Viability Score */}
        <div className="mb-6 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#A0A09E]">
            Viability Score
          </span>
          <ViabilityScoreDisplay score={report.viabilityScore} />
        </div>

        {/* Top Failure Modes */}
        <div className="border-t border-[#E5E2DD] pt-6">
          <div className="mb-4 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-[#B85C38]" />
            <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#B85C38]">
              Top Failure Modes
            </p>
          </div>
          <ul className="space-y-3">
            {report.topFailureModes.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.25 }}
                className="flex items-start gap-3 text-sm text-[#3C3A39]"
              >
                <span className="text-[#B85C38]">&#10007;</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Red Flags */}
        <div className="mt-6 border-t border-[#E5E2DD] pt-6">
          <div className="mb-4 flex items-center gap-2">
            <Flag className="h-4 w-4 text-[#B85C38]" />
            <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#B85C38]">
              Red Flags
            </p>
          </div>
          <ul className="space-y-3">
            {report.redFlags.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.25 }}
                className="flex items-start gap-3 text-sm text-[#3C3A39]"
              >
                <span className="text-[#B85C38]">&#9654;</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Green Flags */}
        <div className="mt-6 border-t border-[#E5E2DD] pt-6">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#4A9B7F]" />
            <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#4A9B7F]">
              Green Flags
            </p>
          </div>
          <ul className="space-y-3">
            {report.greenFlags.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.25 }}
                className="flex items-start gap-3 text-sm text-[#3C3A39]"
              >
                <span className="text-[#4A9B7F]">&#10003;</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Critical Decisions */}
        <div className="mt-6 border-t border-[#E5E2DD] pt-6">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#8B7A3A]" />
            <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#8B7A3A]">
              Critical Decisions
            </p>
          </div>
          <ol className="space-y-3">
            {report.criticalDecisions.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.25 }}
                className="flex items-start gap-3 text-sm text-[#3C3A39]"
              >
                <span className="font-mono text-xs text-[#A0A09E]">{i + 1}.</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Founder Homework */}
        <div className="mt-6 border-t border-[#E5E2DD] pt-6">
          <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#4A9B7F]">
            Founder Homework
          </p>
          <ol className="mt-4 space-y-3">
            {report.founderHomework.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.25 }}
                className="flex items-start gap-3 text-sm text-[#3C3A39]"
              >
                <span className="font-mono text-xs text-[#A0A09E]">{i + 1}.</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Similar cases */}
        {(report.similarSuccesses.length > 0 || report.similarFailures.length > 0) && (
          <div className="mt-6 border-t border-[#E5E2DD] pt-6">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#A0A09E]">
              Similar Cases
            </p>
            {report.similarSuccesses.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-[#4A9B7F]">Similar Successes:</p>
                <p className="text-sm text-[#6B6A69]">{report.similarSuccesses.join(", ")}</p>
              </div>
            )}
            {report.similarFailures.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-[#B85C38]">Similar Failures:</p>
                <p className="text-sm text-[#6B6A69]">{report.similarFailures.join(", ")}</p>
              </div>
            )}
          </div>
        )}

        {/* Download */}
        <div className="mt-6 flex justify-end border-t border-[#E5E2DD] pt-6">
          <button
            onClick={() => generateFounderPDF(report)}
            className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#D1CEC8] bg-white px-4 font-mono text-sm text-[#6B6A69] transition-colors hover:border-[#4A9B7F] hover:text-[#3C3A39]"
          >
            <FileDown className="h-4 w-4" />
            DOWNLOAD REPORT (PDF)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
