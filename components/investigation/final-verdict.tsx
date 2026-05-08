"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, FileDown, Swords } from "lucide-react";
import type { PostmortemReport } from "@/types/investigation";

interface FinalVerdictProps {
  report: PostmortemReport;
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
        <span className="animate-pulse text-[#EF4444]">|</span>
      )}
    </span>
  );
}

function generatePDF(report: PostmortemReport) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Autopsy Report — ${report.subject}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; color: #1a1a1a; background: white; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 3px solid #EF4444; padding-bottom: 20px; margin-bottom: 30px; }
    .brand { font-family: monospace; color: #EF4444; font-size: 12px; letter-spacing: 4px; font-weight: bold; margin-bottom: 8px; }
    h1 { font-size: 28px; color: #0a0a0a; margin-bottom: 6px; }
    .date { color: #666; font-size: 12px; }
    .cause-box { background: #FEF2F2; border: 2px solid #EF4444; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .cause-label { font-size: 10px; letter-spacing: 3px; color: #EF4444; font-weight: bold; margin-bottom: 8px; }
    .cause-text { font-size: 18px; font-weight: bold; color: #0a0a0a; }
    .confidence { margin-top: 10px; font-size: 12px; color: #666; }
    h2 { font-size: 14px; letter-spacing: 2px; color: #EF4444; margin: 28px 0 12px; text-transform: uppercase; font-family: monospace; }
    p { font-size: 14px; line-height: 1.7; color: #333; margin-bottom: 12px; }
    .agent-section { margin: 16px 0; padding: 16px; border: 1px solid #e5e5e5; border-radius: 6px; page-break-inside: avoid; }
    .agent-name { font-weight: bold; font-size: 13px; color: #0a0a0a; margin-bottom: 4px; }
    .agent-cause { font-size: 13px; color: #333; margin-bottom: 8px; }
    .agent-confidence { font-size: 11px; color: #EF4444; font-family: monospace; }
    .agent-analysis { font-size: 12px; color: #555; line-height: 1.6; margin-top: 8px; border-top: 1px solid #f0f0f0; padding-top: 8px; }
    ul, ol { padding-left: 20px; }
    li { font-size: 13px; line-height: 1.8; color: #333; margin-bottom: 4px; }
    .disagreement { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0; padding: 12px; border: 1px solid #fca5a5; border-radius: 6px; page-break-inside: avoid; }
    .dis-topic { font-size: 10px; letter-spacing: 2px; color: #EF4444; font-weight: bold; margin-bottom: 8px; grid-column: 1 / -1; }
    .dis-agent { font-size: 11px; font-weight: bold; margin-bottom: 4px; }
    .dis-pos { font-size: 12px; color: #444; line-height: 1.5; }
    .sources { font-size: 11px; color: #888; margin-top: 6px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 11px; color: #999; text-align: center; font-family: monospace; }
    @media print { body { padding: 20px; } .agent-section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">AUTOPSY — AI FAILURE INVESTIGATOR</div>
    <h1>Postmortem: ${report.subject}</h1>
    <div class="date">Generated ${new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })} · Powered by DeepSeek V4 Pro on AMD MI300X</div>
  </div>
  <div class="cause-box">
    <div class="cause-label">PRIMARY CAUSE OF DEATH</div>
    <div class="cause-text">${report.primaryCauseOfDeath}</div>
    <div class="confidence">Investigator Confidence: ${Math.round(report.confidenceScore * 100)}%</div>
  </div>
  <h2>Executive Summary</h2>
  <p>${report.executiveSummary}</p>
  <h2>What Would Have Saved It</h2>
  <ul>${report.whatWouldHaveSavedIt.map((item: string) => `<li>${item}</li>`).join("")}</ul>
  <h2>Lessons for Builders</h2>
  <ol>${report.lessonsForBuilders.map((item: string) => `<li>${item}</li>`).join("")}</ol>
  <h2>Agent Reports</h2>
  ${report.agentFindings.filter((f) => f.status === "done").map((f) => `<div class="agent-section"><div class="agent-name">${f.displayName}</div><div class="agent-cause">${f.primaryCause}</div><div class="agent-confidence">Confidence: ${Math.round(f.confidence * 100)}%</div><div class="agent-analysis">${f.fullAnalysis}</div>${f.sources.length > 0 ? `<div class="sources">Sources: ${f.sources.map((s) => s.title).join(" · ")}</div>` : ""}</div>`).join("")}
  ${report.disagreements && report.disagreements.length > 0 ? `<h2>Agent Disagreements</h2>${report.disagreements.map((d) => `<div class="disagreement"><div class="dis-topic">${d.topic}</div><div><div class="dis-agent">${d.agentA}</div><div class="dis-pos">${d.agentAPosition}</div></div><div><div class="dis-agent">${d.agentB}</div><div class="dis-pos">${d.agentBPosition}</div></div></div>`).join("")}` : ""}
  <div class="footer">AUTOPSY · 6 AI Agents · 1 Verdict · Built for AMD Developer Hackathon 2026 · autopsy-nine.vercel.app</div>
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

export function FinalVerdict({ report }: FinalVerdictProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mx-auto max-w-5xl space-y-6 pt-12"
    >
      {/* Synthesizer header */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#EF4444]/10 text-[#EF4444]">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <h3 className="text-lg font-semibold text-[#FAFAFA]">
          Final Verdict
        </h3>
      </div>

      {/* Verdict card */}
      <div className="rounded-xl border border-[#EF4444]/30 bg-[#111111] p-6">
        <h4 className="mb-3 font-mono text-sm font-medium uppercase tracking-wider text-[#EF4444]">
          Primary Cause of Death
        </h4>
        <p className="text-xl font-semibold text-[#FAFAFA]">
          {report.primaryCauseOfDeath}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#222222]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${report.confidenceScore * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-[#F97316]"
            />
          </div>
          <span className="shrink-0 text-sm font-medium text-[#F97316]">
            {Math.round(report.confidenceScore * 100)}%
          </span>
        </div>
      </div>

      {/* Executive summary */}
      <div className="rounded-xl border border-[#222222] bg-[#111111] p-6">
        <h4 className="mb-3 font-mono text-sm font-medium uppercase tracking-wider text-[#71717A]">
          Executive Summary
        </h4>
        <p className="text-sm leading-7 text-[#A1A1AA]">
          <TypewriterText text={report.executiveSummary} speed={15} />
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* What Would Have Saved It */}
        <div className="rounded-xl border border-[#222222] bg-[#111111] p-6">
          <h4 className="mb-4 font-mono text-sm font-medium uppercase tracking-wider text-[#22C55E]">
            What Would Have Saved It
          </h4>
          <ul className="space-y-3">
            {report.whatWouldHaveSavedIt.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-start gap-2 text-sm text-[#A1A1AA]"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Lessons for Builders */}
        <div className="rounded-xl border border-[#222222] bg-[#111111] p-6">
          <h4 className="mb-4 font-mono text-sm font-medium uppercase tracking-wider text-[#3B82F6]">
            Lessons for Builders
          </h4>
          <ol className="space-y-3">
            {report.lessonsForBuilders.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-start gap-2 text-sm text-[#A1A1AA]"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[10px] font-bold text-[#3B82F6]">
                  {i + 1}
                </span>
                {item}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      {/* Disagreements */}
      {report.disagreements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F97316]/10 text-[#F97316]">
              <Swords className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#FAFAFA]">
              Agent Disagreements
            </h3>
          </div>
          {report.disagreements.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.2 }}
              className="rounded-xl border border-[#F97316]/20 bg-[#111111] p-5"
            >
              <p className="mb-4 font-mono text-xs font-medium uppercase tracking-wider text-[#F97316]">
                {d.topic}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-[#0A0A0A] p-4">
                  <p className="mb-1 text-xs font-semibold text-[#71717A]">
                    {d.agentA}
                  </p>
                  <p className="text-sm text-[#A1A1AA]">{d.agentAPosition}</p>
                </div>
                <div className="rounded-lg bg-[#0A0A0A] p-4">
                  <p className="mb-1 text-xs font-semibold text-[#71717A]">
                    {d.agentB}
                  </p>
                  <p className="text-sm text-[#A1A1AA]">{d.agentBPosition}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Download button */}
      <div className="flex justify-end">
        <button
          onClick={() => generatePDF(report)}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#222222] bg-[#111111] px-4 text-sm text-[#71717A] transition-colors hover:border-[#EF4444]/30 hover:text-[#FAFAFA]"
        >
          <FileDown className="h-4 w-4" />
          Download Report (PDF)
        </button>
      </div>
    </motion.div>
  );
}
