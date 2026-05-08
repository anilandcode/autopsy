"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import type { PremortemReport } from "@/types/investigation";

interface PremortemVerdictProps {
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
      {displayed.length < text.length && (
        <span className="animate-pulse text-[#FFD60A]">|</span>
      )}
    </span>
  );
}

function RiskScoreDisplay({ score }: { score: number }) {
  const color = score < 40 ? "#06D6A0" : score < 70 ? "#FFD60A" : "#D62828";
  const label = score < 40 ? "LOW RISK" : score < 70 ? "MODERATE RISK" : "HIGH RISK";

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="font-mono text-6xl font-bold"
        style={{ color }}
      >
        {score}
      </span>
      <span
        className="font-mono text-sm font-bold uppercase tracking-[0.2em]"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

function generatePremortemPDF(report: PremortemReport) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const riskColor = report.overallRiskScore < 40 ? "#06D6A0" : report.overallRiskScore < 70 ? "#FFD60A" : "#D62828";

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Autopsy Pre-Mortem — ${report.subject}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; color: #1a1a1a; background: white; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 3px solid ${riskColor}; padding-bottom: 20px; margin-bottom: 30px; }
    .brand { font-family: monospace; color: #D62828; font-size: 12px; letter-spacing: 4px; font-weight: bold; margin-bottom: 8px; }
    h1 { font-size: 28px; color: #0E0E0E; margin-bottom: 6px; }
    .date { color: #666; font-size: 12px; }
    .risk-box { background: #FEF9E7; border: 2px solid ${riskColor}; padding: 20px; margin: 24px 0; text-align: center; }
    .risk-score { font-family: monospace; font-size: 48px; font-weight: bold; color: ${riskColor}; }
    .risk-label { font-family: monospace; font-size: 14px; color: ${riskColor}; letter-spacing: 3px; margin-top: 4px; }
    .threat-text { font-size: 18px; font-weight: bold; color: #0E0E0E; margin-top: 16px; text-align: left; }
    h2 { font-size: 14px; letter-spacing: 2px; color: #D62828; margin: 28px 0 12px; text-transform: uppercase; font-family: monospace; }
    p { font-size: 14px; line-height: 1.7; color: #333; margin-bottom: 12px; }
    ul, ol { padding-left: 20px; }
    li { font-size: 13px; line-height: 1.8; color: #333; margin-bottom: 4px; }
    .agent-section { margin: 16px 0; padding: 16px; border: 1px solid #e5e5e5; page-break-inside: avoid; }
    .agent-name { font-weight: bold; font-size: 13px; color: #0E0E0E; margin-bottom: 4px; }
    .agent-risk { font-size: 13px; color: #D62828; margin-bottom: 8px; font-weight: bold; }
    .agent-analysis { font-size: 12px; color: #555; line-height: 1.6; margin-top: 8px; border-top: 1px solid #f0f0f0; padding-top: 8px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 11px; color: #999; text-align: center; font-family: monospace; }
    @media print { body { padding: 20px; } .agent-section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">AUTOPSY — PRE-MORTEM RISK ANALYSIS</div>
    <h1>Pre-Mortem: ${report.subject}</h1>
    <div class="date">Generated ${new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })} · Powered by DeepSeek V4 Pro on AMD MI300X</div>
  </div>
  <div class="risk-box">
    <div class="risk-score">${report.overallRiskScore}/100</div>
    <div class="risk-label">OVERALL RISK SCORE</div>
    <div class="threat-text">Top Threat: ${report.topThreatToSurvival}</div>
  </div>
  <h2>Most Concerning Risk Category</h2>
  <p>${report.riskCategories}</p>
  <h2>Early Warning System — 10 Signals to Monitor</h2>
  <ol>${report.earlyWarningSystem.map((item: string) => `<li>${item}</li>`).join("")}</ol>
  <h2>Defensive Actions — What the Company Should Do</h2>
  <ol>${report.defensiveActions.map((item: string) => `<li>${item}</li>`).join("")}</ol>
  <h2>Agent Risk Reports</h2>
  ${report.agentFindings.filter((f) => f.status === "done").map((f) => `<div class="agent-section"><div class="agent-name">${f.displayName} — Risk Level: ${f.riskLevel.toUpperCase()}</div><div class="agent-risk">${f.topRisk}</div><div class="agent-analysis">${f.fullAnalysis}</div></div>`).join("")}
  <div class="footer">AUTOPSY · PRE-MORTEM · 6 AI Agents · Built for AMD Developer Hackathon 2026 · autopsy-nine.vercel.app</div>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

export function PremortemVerdict({ report }: PremortemVerdictProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: "linear" }}
      className="mx-auto max-w-5xl space-y-6 pt-12"
    >
      {/* Pre-Mortem header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "linear" }}
        className="mb-8 flex items-center gap-3"
      >
        <h3 className="font-mono text-lg uppercase tracking-[0.1em] text-[#F4F1EA]">
          &sect;03 &mdash; PRE-MORTEM VERDICT
        </h3>
      </motion.div>

      {/* Risk score card — redacted document style */}
      <div className="border-2 border-[#3F3F3F] bg-[#161616] p-6 sm:p-8">
        <div className="mb-4 flex justify-end">
          <span
            className="font-mono text-[10px] uppercase tracking-widest text-[#FFD60A]"
            style={{ transform: "rotate(4deg)", display: "inline-block" }}
          >
            CLASSIFICATION: PRE-MORTEM RISK ASSESSMENT
          </span>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
          <RiskScoreDisplay score={report.overallRiskScore} />
          <div className="flex-1">
            <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#FFD60A]">
              Top Threat to Survival
            </p>
            <p
              className="mt-2 text-3xl sm:text-4xl text-[#F4F1EA]"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              {report.topThreatToSurvival}
            </p>
            <p className="mt-3 text-sm text-[#B8B5AE]">
              {report.riskCategories}
            </p>
          </div>
        </div>
      </div>

      {/* Early Warning System */}
      <div className="border-t border-[#2A2A2A] pt-6">
        <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#FFD60A]">
          Early Warning System — 10 Signals to Monitor
        </p>
        <ul className="mt-4 space-y-3">
          {report.earlyWarningSystem.map((signal, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08, ease: "linear" }}
              className="flex items-start gap-2 text-sm text-[#B8B5AE]"
            >
              <span className="font-mono text-xs text-[#FFD60A]">
                {i + 1}.
              </span>
              <span
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                {signal}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Defensive Actions */}
      <div className="mt-6 border-t border-[#2A2A2A] pt-6">
        <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#06D6A0]">
          Defensive Actions — What the Company Should Do
        </p>
        <ol className="mt-4 space-y-3">
          {report.defensiveActions.map((action, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, ease: "linear" }}
              className="flex items-start gap-3 text-sm text-[#B8B5AE]"
            >
              <span className="font-mono text-xs text-[#71706B]">
                {i + 1}.
              </span>
              <span
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                {action}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Download button */}
      <div className="mt-6 flex justify-end border-t border-[#2A2A2A] pt-6">
        <button
          onClick={() => generatePremortemPDF(report)}
          className="inline-flex h-10 items-center gap-2 border border-[#3F3F3F] bg-[#0E0E0E] px-4 font-mono text-sm text-[#71706B] transition-colors hover:border-[#FFD60A] hover:text-[#F4F1EA]"
        >
          <FileDown className="h-4 w-4" />
          DOWNLOAD PRE-MORTEM REPORT (PDF)
        </button>
      </div>
    </motion.div>
  );
}
