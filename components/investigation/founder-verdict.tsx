"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import type { FounderReport } from "@/types/investigation";

interface FounderVerdictProps {
  report: FounderReport;
}

function ViabilityScoreDisplay({ score }: { score: number }) {
  const color = score >= 70 ? "#06D6A0" : score >= 40 ? "#FFD60A" : "#D62828";
  const label = score >= 70 ? "VIABLE" : score >= 40 ? "RISKY" : "UNVIABLE";

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-6xl font-bold" style={{ color }}>
        {score}
      </span>
      <span className="font-mono text-sm font-bold uppercase tracking-[0.2em]" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

function useFounderHomework(ideaName: string, items: string[]) {
  const key = `founder-homework-${ideaName}`;
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, [key]);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  return { checked, toggle };
}

function generateFounderPDF(report: FounderReport) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const vColor = report.viabilityScore >= 70 ? "#06D6A0" : report.viabilityScore >= 40 ? "#FFD60A" : "#D62828";

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Autopsy Founder Mode — ${report.ideaName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; color: #1a1a1a; background: white; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 3px solid ${vColor}; padding-bottom: 20px; margin-bottom: 30px; }
    .brand { font-family: monospace; color: #D62828; font-size: 12px; letter-spacing: 4px; font-weight: bold; margin-bottom: 8px; }
    h1 { font-size: 28px; color: #0E0E0E; margin-bottom: 6px; }
    .date { color: #666; font-size: 12px; }
    .viability-box { background: #F0FFF4; border: 2px solid ${vColor}; padding: 20px; margin: 24px 0; text-align: center; }
    .viability-score { font-family: monospace; font-size: 48px; font-weight: bold; color: ${vColor}; }
    .viability-label { font-family: monospace; font-size: 14px; color: ${vColor}; letter-spacing: 3px; margin-top: 4px; }
    h2 { font-size: 14px; letter-spacing: 2px; color: #D62828; margin: 28px 0 12px; text-transform: uppercase; font-family: monospace; }
    p { font-size: 14px; line-height: 1.7; color: #333; margin-bottom: 12px; }
    ul, ol { padding-left: 20px; }
    li { font-size: 13px; line-height: 1.8; color: #333; margin-bottom: 4px; }
    .red { color: #D62828; }
    .green { color: #06D6A0; }
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
    <div class="brand">AUTOPSY — FOUNDER MODE</div>
    <h1>Pre-Failure Analysis: ${report.ideaName}</h1>
    <div class="date">Generated ${new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })} · Powered by DeepSeek V4 Pro on AMD MI300X</div>
  </div>
  <div class="viability-box">
    <div class="viability-score">${report.viabilityScore}/100</div>
    <div class="viability-label">VIABILITY SCORE</div>
  </div>
  <h2>Top 3 Failure Modes</h2>
  <ol>${report.topFailureModes.map((m: string) => `<li>${m}</li>`).join("")}</ol>
  <h2 class="red">Red Flags</h2>
  <ul>${report.redFlags.map((f: string) => `<li class="red">${f}</li>`).join("")}</ul>
  <h2 class="green">Green Flags</h2>
  <ul>${report.greenFlags.map((f: string) => `<li class="green">${f}</li>`).join("")}</ul>
  <h2>5 Critical Decisions</h2>
  <ol>${report.criticalDecisions.map((d: string) => `<li>${d}</li>`).join("")}</ol>
  <h2>Founder Homework — Validate This Week</h2>
  <ol>${report.founderHomework.map((h: string) => `<li>${h}</li>`).join("")}</ol>
  <h2>Companies Like You</h2>
  <p><strong>Similar successes:</strong> ${report.similarSuccesses.join("; ") || "None identified"}</p>
  <p><strong>Similar failures:</strong> ${report.similarFailures.join("; ") || "None identified"}</p>
  <h2>Agent Reports</h2>
  ${report.agentFindings.filter((f) => f.status === "done").map((f) => `<div class="agent-section"><div class="agent-name">${f.displayName} — Severity: ${f.severity.toUpperCase()}</div><div class="agent-risk">${f.topFailureMode}</div><div class="agent-analysis">${f.fullAnalysis}</div></div>`).join("")}
  <div class="footer">AUTOPSY · FOUNDER MODE · 6 AI Agents · Built for AMD Developer Hackathon 2026 · autopsy-nine.vercel.app</div>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    setTimeout(() => { printWindow.print(); }, 500);
  };
}

export function FounderVerdict({ report }: FounderVerdictProps) {
  const { checked, toggle } = useFounderHomework(report.ideaName, report.founderHomework);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: "linear" }}
      className="mx-auto max-w-5xl space-y-6 pt-12"
    >
      {/* Founder Mode header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "linear" }}
        className="mb-8 flex items-center gap-3"
      >
        <h3 className="font-mono text-lg uppercase tracking-[0.1em] text-[#F4F1EA]">
          &sect;03 &mdash; FOUNDER MODE VERDICT
        </h3>
      </motion.div>

      {/* Viability Score — redacted document style */}
      <div className="border-2 border-[#3F3F3F] bg-[#161616] p-6 sm:p-8">
        <div className="mb-4 flex justify-end">
          <span
            className="font-mono text-[10px] uppercase tracking-widest text-[#06D6A0]"
            style={{ transform: "rotate(4deg)", display: "inline-block" }}
          >
            CLASSIFICATION: FOUNDER PRE-FAILURE ANALYSIS
          </span>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
          <ViabilityScoreDisplay score={report.viabilityScore} />
          <div className="flex-1">
            <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#06D6A0]">
              Top Failure Modes
            </p>
            <ol className="mt-4 space-y-3">
              {report.topFailureModes.map((mode, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.25, ease: "linear" }}
                  className="flex items-start gap-3 text-sm text-[#B8B5AE]"
                >
                  <span className="font-mono text-xs text-[#D62828]">
                    {i + 1}.
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                  >
                    {mode}
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Red Flags / Green Flags */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="border border-[#2A2A2A] bg-[#0E0E0E] p-5">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.1em] text-[#D62828]">
            Red Flags
          </p>
          <ul className="space-y-3">
            {report.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#B8B5AE]">
                <span className="font-mono text-xs text-[#D62828]">&#10007;</span>
                <span
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                >
                  {flag}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-[#2A2A2A] bg-[#0E0E0E] p-5">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.1em] text-[#06D6A0]">
            Green Flags
          </p>
          <ul className="space-y-3">
            {report.greenFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#B8B5AE]">
                <span className="font-mono text-xs text-[#06D6A0]">&#10003;</span>
                <span
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                >
                  {flag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Founder Homework — THE highlight */}
      <div className="mt-6 border-2 border-[#FFD60A] bg-[#0E0E0E] p-6">
        <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#FFD60A]">
          Founder Homework — Validate This Week
        </p>
        <ul className="space-y-3">
          {report.founderHomework.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggle(i)}
                className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-[#FFD60A]/40 bg-transparent checked:bg-[#FFD60A] checked:border-[#FFD60A] cursor-pointer"
              />
              <span className={checked[i] ? "text-[#5C5852] line-through" : "text-[#F4F1EA]"}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Critical Decisions */}
      <div className="mt-6 border-t border-[#2A2A2A] pt-6">
        <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#71706B]">
          5 Critical Decisions You Must Get Right
        </p>
        <ol className="mt-4 space-y-3">
          {report.criticalDecisions.map((decision, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.25, ease: "linear" }}
              className="flex items-start gap-3 text-sm text-[#B8B5AE]"
            >
              <span className="font-mono text-xs text-[#71706B]">
                {i + 1}.
              </span>
              <span
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                {decision}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Companies Like You */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="border border-[#2A2A2A] bg-[#0E0E0E] p-5">
          <p className="mb-3 font-mono text-sm uppercase tracking-[0.1em] text-[#06D6A0]">
            Similar Successes
          </p>
          <ul className="space-y-2">
            {report.similarSuccesses.length > 0 ? report.similarSuccesses.map((s, i) => (
              <li key={i} className="text-sm text-[#B8B5AE]">
                <span className="font-mono text-xs text-[#06D6A0]">&#10003;</span>{" "}
                <span style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>{s}</span>
              </li>
            )) : <li className="text-sm text-[#5C5852]">No close matches found</li>}
          </ul>
        </div>
        <div className="border border-[#2A2A2A] bg-[#0E0E0E] p-5">
          <p className="mb-3 font-mono text-sm uppercase tracking-[0.1em] text-[#D62828]">
            Similar Failures
          </p>
          <ul className="space-y-2">
            {report.similarFailures.length > 0 ? report.similarFailures.map((f, i) => (
              <li key={i} className="text-sm text-[#B8B5AE]">
                <span className="font-mono text-xs text-[#D62828]">&#10007;</span>{" "}
                <span style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>{f}</span>
              </li>
            )) : <li className="text-sm text-[#5C5852]">No close matches found</li>}
          </ul>
        </div>
      </div>

      {/* Download + Waitlist CTA */}
      <div className="mt-6 flex flex-col items-end gap-4 border-t border-[#2A2A2A] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => generateFounderPDF(report)}
          className="inline-flex h-10 items-center gap-2 border border-[#3F3F3F] bg-[#0E0E0E] px-4 font-mono text-sm text-[#71706B] transition-colors hover:border-[#06D6A0] hover:text-[#F4F1EA]"
        >
          <FileDown className="h-4 w-4" />
          DOWNLOAD FOUNDER REPORT (PDF)
        </button>
        <div className="border border-[#FFD60A]/20 bg-[#FFD60A]/5 px-5 py-3 text-center">
          <p className="mb-2 font-mono text-xs text-[#71706B]">
            Want to track these risks over time? Get notified when patterns shift.
          </p>
          <a
            href="mailto:waitlist@autopsy.ai?subject=Founder%20Mode%20Waitlist%20-%20${encodeURIComponent(report.ideaName)}"
            className="inline-flex h-9 items-center gap-2 bg-[#FFD60A] px-5 font-mono text-sm font-bold text-[#0E0E0E] transition-colors hover:bg-[#E6C000]"
          >
            JOIN WAITLIST
          </a>
        </div>
      </div>
    </motion.div>
  );
}
