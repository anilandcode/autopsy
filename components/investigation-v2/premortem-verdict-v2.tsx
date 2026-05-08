"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileDown, ShieldAlert } from "lucide-react";
import type { PremortemReport } from "@/types/investigation";

interface PremortemVerdictV2Props {
  report: PremortemReport;
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
      {displayed.length < text.length && <span className="animate-pulse text-[#8B7A3A]">|</span>}
    </span>
  );
}

function RiskScoreDisplay({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const filled = Math.round(pct / 10);
  const empty = 10 - filled;
  const color = score > 0.7 ? "#B85C38" : score > 0.4 ? "#8B7A3A" : "#4A9B7F";
  const label = score > 0.7 ? "HIGH RISK" : score > 0.4 ? "MODERATE RISK" : "LOW RISK";

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

function generatePremortemPDF(report: PremortemReport) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Pre-Mortem Report — ${report.subject}</title>
<style>
  @page { margin: 1.5cm; size: A4; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #3C3A39; line-height: 1.6; padding: 0; margin: 0; }
  .header { border-bottom: 2px solid #8B7A3A; padding-bottom: 12px; margin-bottom: 24px; }
  .case-label { font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8B7A3A; }
  h1 { font-size: 24px; font-weight: 700; margin: 8px 0 0; color: #3C3A39; }
  .meta { font-family: ui-monospace, monospace; font-size: 11px; color: #6B6A69; margin-top: 6px; }
  .section { margin-bottom: 20px; }
  .section-title { font-family: ui-monospace, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #8B7A3A; margin-bottom: 8px; }
  .threat { font-size: 18px; font-weight: 600; color: #3C3A39; margin: 0; }
  ul, ol { padding-left: 18px; margin: 6px 0 0; }
  li { margin-bottom: 4px; font-size: 13px; }
  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #E5E2DD; font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #A0A09E; }
</style>
</head>
<body>
  <div class="header">
    <div class="case-label">Pre-Mortem Assessment</div>
    <h1>${report.subject}</h1>
    <div class="meta">Risk Score: ${Math.round(report.overallRiskScore * 100)}% &nbsp;|&nbsp; Generated: ${new Date(report.generatedAt).toLocaleString()}</div>
  </div>

  <div class="section">
    <div class="section-title">Top Threat to Survival</div>
    <p class="threat">${report.topThreatToSurvival}</p>
  </div>

  <div class="section">
    <div class="section-title">Risk Categories</div>
    <p style="font-size:14px; color:#3C3A39; margin:0;">${report.riskCategories}</p>
  </div>

  <div class="section">
    <div class="section-title">Early Warning System</div>
    <ul>
      ${report.earlyWarningSystem.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Defensive Actions</div>
    <ol>
      ${report.defensiveActions.map((item) => `<li>${item}</li>`).join("")}
    </ol>
  </div>

  <div class="footer">
    AUTOPSY / PRE-MORTEM / 6 AGENTS / PARALLEL RESEARCH
  </div>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 300);
}

export function PremortemVerdictV2({ report }: PremortemVerdictV2Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "linear" }}
      className="mx-auto max-w-5xl"
    >
      <div className="mb-6 flex items-center gap-3">
        <ShieldAlert className="h-4 w-4 text-[#8B7A3A]" />
        <h3
          className="font-mono text-lg uppercase tracking-[0.1em] text-[#3C3A39]"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          &sect;03 &mdash; PRE-MORTEM ASSESSMENT
        </h3>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#E5E2DD] bg-white p-6 sm:p-8">
        {/* Top Threat */}
        <div className="mb-6">
          <span className="inline-block rounded-full bg-[#EDE6DB] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#3C3A39]">
            TOP THREAT
          </span>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="text-2xl font-semibold leading-snug text-[#3C3A39] sm:text-3xl"
        >
          {report.topThreatToSurvival}
        </motion.p>

        {/* Risk Score */}
        <div className="mt-6 flex items-center justify-between border-t border-[#E5E2DD] pt-4">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#A0A09E]">
            Overall Risk Score
          </span>
          <RiskScoreDisplay score={report.overallRiskScore} />
        </div>

        {/* Risk Categories */}
        <div className="mt-6 border-t border-[#E5E2DD] pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#A0A09E]">
            Risk Categories
          </p>
          <p className="mt-3 text-base leading-7 text-[#6B6A69]">
            <TypewriterText text={report.riskCategories} speed={15} />
          </p>
        </div>

        {/* Early Warnings */}
        <div className="mt-6 border-t border-[#E5E2DD] pt-6">
          <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#8B7A3A]">
            Early Warning System
          </p>
          <ul className="mt-4 space-y-3">
            {report.earlyWarningSystem.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.25 }}
                className="flex items-start gap-3 text-sm text-[#3C3A39]"
              >
                <span className="text-[#8B7A3A]">&#9888;</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Defensive Actions */}
        <div className="mt-6 border-t border-[#E5E2DD] pt-6">
          <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#4A9B7F]">
            Defensive Actions — What the Company Should Do
          </p>
          <ol className="mt-4 space-y-3">
            {report.defensiveActions.map((action, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.25 }}
                className="flex items-start gap-3 text-sm text-[#3C3A39]"
              >
                <span className="font-mono text-xs text-[#A0A09E]">{i + 1}.</span>
                <span>{action}</span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Download */}
        <div className="mt-6 flex justify-end border-t border-[#E5E2DD] pt-6">
          <button
            onClick={() => generatePremortemPDF(report)}
            className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#D1CEC8] bg-white px-4 font-mono text-sm text-[#6B6A69] transition-colors hover:border-[#8B7A3A] hover:text-[#3C3A39]"
          >
            <FileDown className="h-4 w-4" />
            DOWNLOAD REPORT (PDF)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
