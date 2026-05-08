"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileDown, Swords } from "lucide-react";
import type { PostmortemReport } from "@/types/investigation";

interface FinalVerdictV2Props {
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
        <span className="animate-pulse text-[#81B09A]">|</span>
      )}
    </span>
  );
}

function TerminalConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const filled = Math.round(pct / 10);
  const empty = 10 - filled;
  const color =
    value > 0.7 ? "#4A9B7F" : value > 0.4 ? "#8B7A3A" : "#B85C38";

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

  const confidencePct = Math.round(report.confidenceScore * 100);

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Autopsy Report — ${report.subject}</title>
<style>
  @page { margin: 1.5cm; size: A4; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #3C3A39; line-height: 1.6; padding: 0; margin: 0; }
  .header { border-bottom: 2px solid #81B09A; padding-bottom: 12px; margin-bottom: 24px; }
  .case-label { font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #81B09A; }
  h1 { font-size: 24px; font-weight: 700; margin: 8px 0 0; color: #3C3A39; }
  .meta { font-family: ui-monospace, monospace; font-size: 11px; color: #6B6A69; margin-top: 6px; }
  .section { margin-bottom: 20px; }
  .section-title { font-family: ui-monospace, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #81B09A; margin-bottom: 8px; }
  .primary-cause { font-size: 18px; font-weight: 600; color: #3C3A39; margin: 0; }
  .confidence { font-family: ui-monospace, monospace; font-size: 13px; color: #6B6A69; }
  .summary { font-size: 14px; color: #3C3A39; margin-top: 8px; }
  ul, ol { padding-left: 18px; margin: 6px 0 0; }
  li { margin-bottom: 4px; font-size: 13px; }
  .disagreement-box { border: 1px solid #E5E2DD; border-radius: 12px; padding: 12px; margin-top: 8px; background: #FEFCF5; }
  .disagreement-agent { font-family: ui-monospace, monospace; font-size: 10px; color: #6B6A69; margin-bottom: 4px; }
  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #E5E2DD; font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #A0A09E; }
</style>
</head>
<body>
  <div class="header">
    <div class="case-label">Forensic Report</div>
    <h1>${report.subject}</h1>
    <div class="meta">Case #: 2026-${String(Math.floor(Math.random() * 9000) + 1000)} &nbsp;|&nbsp; Generated: ${new Date(report.generatedAt).toLocaleString()} &nbsp;|&nbsp; Confidence: ${confidencePct}%</div>
  </div>

  <div class="section">
    <div class="section-title">Primary Cause</div>
    <p class="primary-cause">${report.primaryCauseOfDeath}</p>
  </div>

  <div class="section">
    <div class="section-title">Executive Summary</div>
    <p class="summary">${report.executiveSummary}</p>
  </div>

  <div class="section">
    <div class="section-title">What Would Have Saved It</div>
    <ul>
      ${report.whatWouldHaveSavedIt.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Lessons for Builders</div>
    <ol>
      ${report.lessonsForBuilders.map((item) => `<li>${item}</li>`).join("")}
    </ol>
  </div>

  ${report.mostConsequentialDisagreement ? `
  <div class="section">
    <div class="section-title">Pivotal Disagreement</div>
    <div class="disagreement-box">
      <div class="disagreement-agent">${report.mostConsequentialDisagreement.agentA} vs ${report.mostConsequentialDisagreement.agentB}</div>
      <p style="font-size:13px; margin:0; color:#3C3A39;">${report.mostConsequentialDisagreement.topic}</p>
      <p style="font-size:12px; margin-top:6px; color:#6B6A69;"><strong>Verdict:</strong> ${report.mostConsequentialDisagreement.whoseRightAndWhy}</p>
    </div>
  </div>
  ` : ""}

  <div class="footer">
    AUTOPSY / 6 AGENTS / PARALLEL RESEARCH / CROSS-AGENT DEBATE
  </div>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 300);
}

export function FinalVerdictV2({ report }: FinalVerdictV2Props) {
  const confidencePct = Math.round(report.confidenceScore * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "linear" }}
      className="mx-auto max-w-5xl"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-[#81B09A]" />
        <h3
          className="font-mono text-lg uppercase tracking-[0.1em] text-[#3C3A39]"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          &sect;03 &mdash; FORENSIC VERDICT
        </h3>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#E5E2DD] bg-white p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <span
            className="inline-block rounded-full bg-[#C6DACC] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#3C3A39]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            PRIMARY CAUSE
          </span>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="text-2xl font-semibold leading-snug text-[#3C3A39] sm:text-3xl"
        >
          {report.primaryCauseOfDeath}
        </motion.p>

        {/* Confidence */}
        <div className="mt-6 flex items-center justify-between border-t border-[#E5E2DD] pt-4">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#A0A09E]">
            Investigator Confidence: {confidencePct}%
          </span>
          <TerminalConfidenceBar value={report.confidenceScore} />
        </div>

        {/* Executive summary */}
        <div className="relative mt-6 border-t border-[#E5E2DD] pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#A0A09E]">
            Executive Summary
          </p>
          <div className="absolute right-0 top-6 hidden w-32 text-right sm:block">
            <span
              className="font-mono text-[9px] uppercase tracking-wider text-[#81B09A]"
              style={{ transform: "rotate(-2deg)", display: "inline-block" }}
            >
              Note: findings are preliminary &mdash; see agent reports for detail
            </span>
          </div>
          <p className="mt-3 pr-0 text-base leading-7 text-[#6B6A69] sm:pr-36">
            <TypewriterText text={report.executiveSummary} speed={15} />
          </p>
        </div>

        {/* What would have saved it */}
        <div className="mt-6 border-t border-[#E5E2DD] pt-6">
          <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#4A9B7F]">
            What Would Have Saved It
          </p>
          <ul className="mt-4 space-y-3">
            {report.whatWouldHaveSavedIt.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.25, ease: "linear" }}
                className="flex items-start gap-3 text-sm text-[#3C3A39]"
              >
                <span className="text-[#81B09A]">&#10003;</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Lessons for builders */}
        <div className="mt-6 border-t border-[#E5E2DD] pt-6">
          <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#A0A09E]">
            Lessons for Builders
          </p>
          <ol className="mt-4 space-y-3">
            {report.lessonsForBuilders.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.25, ease: "linear" }}
                className="flex items-start gap-3 text-sm text-[#3C3A39]"
              >
                <span className="font-mono text-xs text-[#A0A09E]">{i + 1}.</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Pivotal disagreement */}
        {report.mostConsequentialDisagreement && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.25, ease: "linear" }}
            className="mt-6 overflow-hidden rounded-[20px] border-2 border-[#81B09A] bg-[#FEFCF5] p-6"
          >
            <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#81B09A]">
              The Pivotal Disagreement
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#A0A09E]">
              {report.mostConsequentialDisagreement.agentA} vs{" "}
              {report.mostConsequentialDisagreement.agentB}
            </p>
            <p className="mt-2 text-lg font-semibold text-[#3C3A39]">
              {report.mostConsequentialDisagreement.topic}
            </p>
            <div className="mt-3 border-t border-[#E5E2DD] pt-3">
              <p className="text-sm leading-7 text-[#6B6A69]">
                <span className="font-mono text-xs uppercase tracking-wider text-[#81B09A]">
                  Verdict:{" "}
                </span>
                {report.mostConsequentialDisagreement.whoseRightAndWhy}
              </p>
            </div>
          </motion.div>
        )}

        {/* Agent disagreements */}
        {report.disagreements.length > 0 && (
          <div className="mt-6 border-t border-[#E5E2DD] pt-6">
            <div className="mb-4 flex items-center gap-2">
              <Swords className="h-3 w-3 text-[#A0A09E]" />
              <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#A0A09E]">
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
                  className="overflow-hidden rounded-[16px] border border-[#E5E2DD] bg-[#FEFCF5] p-5"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#A0A09E]">
                    {d.topic}
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[12px] border border-[#E5E2DD] bg-white p-4">
                      <p className="font-mono text-xs uppercase tracking-wider text-[#A0A09E]">
                        {d.agentA}
                      </p>
                      <p className="mt-1 text-sm text-[#6B6A69]">{d.agentAPosition}</p>
                    </div>
                    <div className="rounded-[12px] border border-[#E5E2DD] bg-white p-4">
                      <p className="font-mono text-xs uppercase tracking-wider text-[#A0A09E]">
                        {d.agentB}
                      </p>
                      <p className="mt-1 text-sm text-[#6B6A69]">{d.agentBPosition}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Download button */}
        <div className="mt-6 flex justify-end border-t border-[#E5E2DD] pt-6">
          <button
            onClick={() => generatePDF(report)}
            className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#D1CEC8] bg-white px-4 font-mono text-sm text-[#6B6A69] transition-colors hover:border-[#81B09A] hover:text-[#3C3A39]"
          >
            <FileDown className="h-4 w-4" />
            DOWNLOAD REPORT (PDF)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
