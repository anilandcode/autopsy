"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileDown, Swords } from "lucide-react";
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
        <span className="animate-pulse text-[#D62828]">|</span>
      )}
    </span>
  );
}

function TerminalConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const filled = Math.round(pct / 10);
  const empty = 10 - filled;
  const color =
    value > 0.7
      ? "#06D6A0"
      : value > 0.4
        ? "#FFD60A"
        : "#D62828";

  return (
    <span className="font-mono text-sm" style={{ color }}>
      {"█".repeat(filled)}
      {"░".repeat(empty)} {pct}%
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
    .header { border-bottom: 3px solid #D62828; padding-bottom: 20px; margin-bottom: 30px; }
    .brand { font-family: monospace; color: #D62828; font-size: 12px; letter-spacing: 4px; font-weight: bold; margin-bottom: 8px; }
    h1 { font-size: 28px; color: #0E0E0E; margin-bottom: 6px; }
    .date { color: #666; font-size: 12px; }
    .cause-box { background: #FEF2F2; border: 2px solid #D62828; padding: 20px; margin: 24px 0; }
    .cause-label { font-size: 10px; letter-spacing: 3px; color: #D62828; font-weight: bold; margin-bottom: 8px; }
    .cause-text { font-size: 18px; font-weight: bold; color: #0E0E0E; }
    .confidence { margin-top: 10px; font-size: 12px; color: #666; font-family: monospace; }
    h2 { font-size: 14px; letter-spacing: 2px; color: #D62828; margin: 28px 0 12px; text-transform: uppercase; font-family: monospace; }
    p { font-size: 14px; line-height: 1.7; color: #333; margin-bottom: 12px; }
    .agent-section { margin: 16px 0; padding: 16px; border: 1px solid #e5e5e5; page-break-inside: avoid; }
    .agent-name { font-weight: bold; font-size: 13px; color: #0E0E0E; margin-bottom: 4px; }
    .agent-cause { font-size: 13px; color: #333; margin-bottom: 8px; }
    .agent-confidence { font-size: 11px; color: #D62828; font-family: monospace; }
    .agent-analysis { font-size: 12px; color: #555; line-height: 1.6; margin-top: 8px; border-top: 1px solid #f0f0f0; padding-top: 8px; }
    ul, ol { padding-left: 20px; }
    li { font-size: 13px; line-height: 1.8; color: #333; margin-bottom: 4px; }
    .disagreement { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0; padding: 12px; border: 1px solid #2A2A2A; page-break-inside: avoid; }
    .dis-topic { font-size: 10px; letter-spacing: 2px; color: #5C5852; font-weight: bold; margin-bottom: 8px; grid-column: 1 / -1; }
    .dis-agent { font-size: 11px; font-weight: bold; margin-bottom: 4px; }
    .dis-pos { font-size: 12px; color: #444; line-height: 1.5; }
    .sources { font-size: 11px; color: #888; margin-top: 6px; }
    .pivotal { border: 2px solid #D62828; padding: 16px; margin: 16px 0; }
    .pivotal-label { font-size: 10px; letter-spacing: 2px; color: #D62828; font-weight: bold; margin-bottom: 8px; font-family: monospace; }
    .pivotal-agents { font-size: 13px; color: #D62828; margin-bottom: 8px; font-family: monospace; }
    .pivotal-topic { font-size: 16px; color: #0E0E0E; font-weight: bold; margin-bottom: 8px; }
    .pivotal-verdict { font-size: 13px; color: #333; line-height: 1.6; }
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
  <ul>${report.whatWouldHaveSavedIt.map((item: string) => `<li>&#10003; ${item}</li>`).join("")}</ul>
  <h2>Lessons for Builders</h2>
  <ol>${report.lessonsForBuilders.map((item: string) => `<li>${item}</li>`).join("")}</ol>
  <h2>Agent Reports</h2>
  ${report.agentFindings.filter((f) => f.status === "done").map((f) => `<div class="agent-section"><div class="agent-name">${f.displayName}</div><div class="agent-cause">${f.primaryCause}</div><div class="agent-confidence">Confidence: ${Math.round(f.confidence * 100)}%</div><div class="agent-analysis">${f.fullAnalysis}</div>${f.sources.length > 0 ? `<div class="sources">Sources: ${f.sources.map((s) => s.title).join(" · ")}</div>` : ""}</div>`).join("")}
  ${report.debateRound && report.debateRound.length > 0 ? `<h2>Debate Round</h2>${report.debateRound.map((d) => `<div class="agent-section"><div class="agent-name">${d.agentRole}</div><div class="agent-risk" style="color:#D62828">Disagreement filed against ${d.disagreesWith}: ${d.disagreementReason}</div><div style="font-size:12px;color:#06D6A0;margin-top:4px">Agreement filed with ${d.agreesWith}: ${d.agreementReason}</div></div>`).join("")}` : ""}
  ${report.mostConsequentialDisagreement ? `<div class="pivotal"><div class="pivotal-label">THE PIVOTAL DISAGREEMENT</div><div class="pivotal-agents">${report.mostConsequentialDisagreement.agentA} vs ${report.mostConsequentialDisagreement.agentB}</div><div class="pivotal-topic">${report.mostConsequentialDisagreement.topic}</div><div class="pivotal-verdict">${report.mostConsequentialDisagreement.whoseRightAndWhy}</div></div>` : ""}
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
  const confidencePct = Math.round(report.confidenceScore * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.2, ease: "linear" }}
      className="mx-auto max-w-5xl pt-12"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "linear" }}
        className="mb-8 flex items-center gap-3"
      >
        <h3 className="font-mono text-lg uppercase tracking-[0.1em] text-[#F4F1EA]">
          &sect;03 &mdash; VERDICT
        </h3>
      </motion.div>

      {/* Redacted document */}
      <div className="border-2 border-[#3F3F3F] bg-[#161616] p-6 sm:p-8">
        {/* Classification stamp */}
        <div className="mb-6 flex justify-end">
          <span
            className="font-mono text-[10px] uppercase tracking-widest text-[#D62828]"
            style={{ transform: "rotate(4deg)", display: "inline-block" }}
          >
            CLASSIFICATION: PUBLIC RECORD
          </span>
        </div>

        {/* Primary cause of death */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.3, ease: "linear" }}
        >
          <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#D62828]">
            Primary Cause of Death
          </p>
          <p
            className="mt-2 text-3xl sm:text-5xl text-[#F4F1EA]"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            {report.primaryCauseOfDeath}
          </p>
        </motion.div>

        {/* Confidence bar */}
        <div className="mt-6 flex items-center justify-between border-t border-[#2A2A2A] pt-4">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#71706B]">
            Investigator Confidence: {confidencePct}%
          </span>
          <TerminalConfidenceBar value={report.confidenceScore} />
        </div>

        {/* Executive summary with margin note */}
        <div className="relative mt-6 border-t border-[#2A2A2A] pt-6">
          <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#5C5852]">
            Executive Summary
          </p>
          {/* Fake margin note — hidden on mobile */}
          <div className="absolute right-0 top-6 hidden w-32 text-right sm:block">
            <span
              className="font-mono text-[9px] uppercase tracking-wider text-[#D62828]"
              style={{ transform: "rotate(-2deg)", display: "inline-block" }}
            >
              Note: findings are preliminary &mdash; see agent reports for detail
            </span>
          </div>
          <p
            className="mt-3 pr-0 text-lg leading-8 text-[#B8B5AE] sm:pr-36"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            <TypewriterText text={report.executiveSummary} speed={15} />
          </p>
        </div>

        {/* What would have saved it */}
        <div className="mt-6 border-t border-[#2A2A2A] pt-6">
          <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#06D6A0]">
            What Would Have Saved It
          </p>
          <ul className="mt-4 space-y-3">
            {report.whatWouldHaveSavedIt.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.25, ease: "linear" }}
                className="flex items-start gap-2 text-sm text-[#B8B5AE]"
              >
                <span className="font-mono text-sm text-[#06D6A0]">&#10003;</span>
                <span
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                >
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Lessons for builders */}
        <div className="mt-6 border-t border-[#2A2A2A] pt-6">
          <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#71706B]">
            Lessons for Builders
          </p>
          <ol className="mt-4 space-y-3">
            {report.lessonsForBuilders.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.25, ease: "linear" }}
                className="flex items-start gap-3 text-sm text-[#B8B5AE]"
              >
                <span className="font-mono text-xs text-[#5C5852]">{i + 1}.</span>
                <span
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                >
                  {item}
                </span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* The pivotal disagreement */}
        {report.mostConsequentialDisagreement && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.25, ease: "linear" }}
            className="mt-6 border-2 border-[#D62828] bg-[#0E0E0E] p-6"
          >
            <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#D62828]">
              The Pivotal Disagreement
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#5C5852]">
              {report.mostConsequentialDisagreement.agentA} vs{" "}
              {report.mostConsequentialDisagreement.agentB}
            </p>
            <p
              className="mt-2 text-lg text-[#F4F1EA]"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              {report.mostConsequentialDisagreement.topic}
            </p>
            <div className="mt-3 border-t border-[#2A2A2A] pt-3">
              <p className="text-sm leading-7 text-[#B8B5AE]">
                <span className="font-mono text-xs uppercase tracking-wider text-[#D62828]">
                  Verdict:{" "}
                </span>
                {report.mostConsequentialDisagreement.whoseRightAndWhy}
              </p>
            </div>
          </motion.div>
        )}

        {/* Agent disagreements */}
        {report.disagreements.length > 0 && (
          <div className="mt-6 border-t border-[#2A2A2A] pt-6">
            <div className="mb-4 flex items-center gap-2">
              <Swords className="h-3 w-3 text-[#5C5852]" />
              <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#5C5852]">
                Agent Disagreements
              </p>
            </div>
            <div className="space-y-4">
              {report.disagreements.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.25, ease: "linear" }}
                  className="border border-[#2A2A2A] bg-[#0E0E0E] p-5"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#5C5852]">
                    {d.topic}
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="border border-[#2A2A2A] bg-[#161616] p-4">
                      <p className="font-mono text-xs uppercase tracking-wider text-[#71706B]">
                        {d.agentA}
                      </p>
                      <p
                        className="mt-1 text-sm text-[#B8B5AE]"
                        style={{
                          fontFamily:
                            "var(--font-instrument-serif), Georgia, serif",
                        }}
                      >
                        {d.agentAPosition}
                      </p>
                    </div>
                    <div className="border border-[#2A2A2A] bg-[#161616] p-4">
                      <p className="font-mono text-xs uppercase tracking-wider text-[#71706B]">
                        {d.agentB}
                      </p>
                      <p
                        className="mt-1 text-sm text-[#B8B5AE]"
                        style={{
                          fontFamily:
                            "var(--font-instrument-serif), Georgia, serif",
                        }}
                      >
                        {d.agentBPosition}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Download button */}
        <div className="mt-6 flex justify-end border-t border-[#2A2A2A] pt-6">
          <button
            onClick={() => generatePDF(report)}
            className="inline-flex h-10 items-center gap-2 border border-[#3F3F3F] bg-[#0E0E0E] px-4 font-mono text-sm text-[#71706B] transition-colors hover:border-[#D62828] hover:text-[#F4F1EA]"
          >
            <FileDown className="h-4 w-4" />
            DOWNLOAD REPORT (PDF)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
