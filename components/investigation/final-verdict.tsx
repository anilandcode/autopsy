"use client";

import { motion } from "framer-motion";
import { FileDown, Swords, ChevronRight } from "lucide-react";
import type { PostmortemReport, AgentRole } from "@/types/investigation";

const agentNames: Record<AgentRole, string> = {
  "market-analyst": "Market Analyst",
  operator: "The Operator",
  "money-trail": "Money Trail",
  "customer-voice": "Customer Voice",
  engineer: "The Engineer",
  historian: "The Historian",
  synthesizer: "The Synthesizer",
};

interface FinalVerdictProps {
  report: PostmortemReport;
  onExploreCounterfactual?: () => void;
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    value > 0.7
      ? "#00A67E"
      : value > 0.4
        ? "#8F47AE"
        : "#4B4BA0";

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-[rgba(255,255,255,0.1)]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-sm font-medium" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}

function generatePDF(report: PostmortemReport) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const doneAgents = report.agentFindings.filter((f) => f.status === "done");
  const debateItems = report.debateRound || [];
  const disagreements = report.disagreements || [];
  const mcd = report.mostConsequentialDisagreement;

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Autopsy — ${report.subject}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'JetBrains Mono', monospace;
      color: #1a1a1a;
      background: #fff;
      padding: 48px;
      max-width: 800px;
      margin: 0 auto;
      font-size: 13px;
      line-height: 1.6;
    }

    .header {
      border-bottom: 3px solid #4B4BA0;
      padding-bottom: 24px;
      margin-bottom: 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand { font-size: 11px; color: #4B4BA0; letter-spacing: 2px; font-weight: 700; margin-bottom: 8px; }
    .subject { font-family: 'Instrument Serif', Georgia, serif; font-size: 32px; color: #0F1110; margin-bottom: 4px; }
    .date { font-size: 11px; color: #888; }
    .mode-pill { font-size: 10px; color: #4B4BA0; border: 1px solid #4B4BA0; padding: 2px 10px; border-radius: 999px; }

    .section { margin-bottom: 36px; page-break-inside: avoid; }
    .section-num { font-size: 10px; color: #4B4BA0; letter-spacing: 1px; font-weight: 700; margin-bottom: 4px; }
    .section-title { font-size: 11px; color: #A1A1AA; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; }
    .divider { height: 1px; background: #e5e5e5; margin: 36px 0; }

    .cause-box {
      background: #FEF2F2;
      border-left: 4px solid #4B4BA0;
      padding: 20px 24px;
    }
    .cause-text {
      font-family: 'Instrument Serif', Georgia, serif;
      font-size: 22px;
      color: #0F1110;
      line-height: 1.4;
    }
    .confidence-row { margin-top: 12px; display: flex; align-items: center; gap: 10px; }
    .confidence-label { font-size: 10px; color: #888; }
    .confidence-bar-bg { flex: 1; height: 8px; background: #e5e5e5; border-radius: 99px; }
    .confidence-bar-fill { height: 100%; border-radius: 99px; }
    .confidence-pct { font-size: 12px; font-weight: 700; }

    .summary-text {
      font-family: 'Instrument Serif', Georgia, serif;
      font-size: 16px;
      color: #333;
      line-height: 1.8;
    }

    .agent-card {
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      padding: 16px 20px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .agent-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .agent-name { font-weight: 700; font-size: 12px; color: #0F1110; }
    .agent-confidence { font-size: 10px; color: #4B4BA0; }
    .agent-cause { font-size: 13px; color: #333; margin-bottom: 6px; }
    .agent-analysis { font-size: 12px; color: #555; line-height: 1.6; border-top: 1px solid #f0f0f0; padding-top: 8px; margin-top: 8px; }
    .agent-sources { font-size: 10px; color: #999; margin-top: 6px; }

    .debate-row { margin-bottom: 10px; padding: 12px 16px; border: 1px solid #f0f0f0; border-radius: 4px; page-break-inside: avoid; }
    .debate-agent { font-size: 11px; font-weight: 700; color: #0F1110; }
    .debate-disagree { font-size: 11px; color: #4B4BA0; margin-top: 4px; }
    .debate-agree { font-size: 11px; color: #00A67E; margin-top: 4px; }
    .debate-quote { font-family: 'Instrument Serif', Georgia, serif; font-style: italic; font-size: 13px; color: #444; margin-top: 2px; }

    .list-item { display: flex; gap: 10px; margin-bottom: 8px; align-items: flex-start; }
    .list-num { font-size: 11px; color: #4B4BA0; font-weight: 700; min-width: 22px; }
    .list-text { font-size: 13px; color: #333; line-height: 1.6; }
    .list-text-serif { font-family: 'Instrument Serif', Georgia, serif; font-size: 14px; color: #333; line-height: 1.7; }

    .disagreement-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 12px;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .dis-topic { font-size: 10px; color: #888; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 8px; grid-column: 1 / -1; text-transform: uppercase; }
    .dis-agent { font-size: 11px; font-weight: 700; color: #0F1110; margin-bottom: 4px; }
    .dis-pos { font-size: 12px; color: #444; line-height: 1.5; }

    .pivotal {
      border: 2px solid #4B4BA0;
      border-radius: 6px;
      padding: 20px;
      page-break-inside: avoid;
    }
    .pivotal-label { font-size: 10px; color: #4B4BA0; letter-spacing: 1px; font-weight: 700; margin-bottom: 8px; }
    .pivotal-agents { font-size: 12px; color: #4B4BA0; margin-bottom: 8px; }
    .pivotal-topic { font-family: 'Instrument Serif', Georgia, serif; font-size: 18px; color: #0F1110; margin-bottom: 8px; }
    .pivotal-verdict { font-size: 13px; color: #333; line-height: 1.6; }

    .footer {
      margin-top: 48px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      font-size: 10px;
      color: #bbb;
      text-align: center;
      letter-spacing: 0.5px;
    }

    @media print {
      body { padding: 24px; }
      .agent-card, .debate-row, .pivotal, .disagreement-grid { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">AUTOPSY</div>
      <div class="subject">${report.subject}</div>
      <div class="date">${new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    </div>
    <div class="mode-pill">Postmortem</div>
  </div>

  <!-- §01 Primary Cause of Death -->
  <div class="section">
    <div class="section-num">§01</div>
    <div class="section-title">Primary cause of death</div>
    <div class="cause-box">
      <div class="cause-text">${report.primaryCauseOfDeath}</div>
      <div class="confidence-row">
        <span class="confidence-label">Confidence</span>
        <div class="confidence-bar-bg">
          <div class="confidence-bar-fill" style="width:${Math.round(report.confidenceScore * 100)}%; background-color:${report.confidenceScore > 0.7 ? "#00A67E" : report.confidenceScore > 0.4 ? "#8F47AE" : "#4B4BA0"}"></div>
        </div>
        <span class="confidence-pct" style="color:${report.confidenceScore > 0.7 ? "#00A67E" : report.confidenceScore > 0.4 ? "#8F47AE" : "#4B4BA0"}">${Math.round(report.confidenceScore * 100)}%</span>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- §02 Executive Summary -->
  <div class="section">
    <div class="section-num">§02</div>
    <div class="section-title">Executive summary</div>
    <div class="summary-text">${report.executiveSummary}</div>
  </div>

  <div class="divider"></div>

  <!-- §03 Agent Findings -->
  <div class="section">
    <div class="section-num">§03</div>
    <div class="section-title">Agent findings</div>
    ${doneAgents.map((f) => `
    <div class="agent-card">
      <div class="agent-header">
        <div class="agent-name">${f.displayName}</div>
        <div class="agent-confidence">${Math.round(f.confidence * 100)}%</div>
      </div>
      <div class="agent-cause">${f.primaryCause}</div>
      <div class="agent-analysis">${f.fullAnalysis}</div>
      ${f.sources.length > 0 ? `<div class="agent-sources">Sources: ${f.sources.map((s) => s.title).join(" · ")}</div>` : ""}
    </div>`).join("")}
  </div>

  <div class="divider"></div>

  <!-- §04 Debate Room -->
  ${debateItems.length > 0 ? `
  <div class="section">
    <div class="section-num">§04</div>
    <div class="section-title">Debate room</div>
    ${debateItems.map((d) => `
    <div class="debate-row">
      <div class="debate-agent">${agentNames[d.agentRole] || d.agentRole}</div>
      <div class="debate-disagree">Disagrees with ${agentNames[d.disagreesWith] || d.disagreesWith}</div>
      <div class="debate-quote">${d.disagreementReason || "Withheld comment"}</div>
      <div class="debate-agree">Agrees with ${agentNames[d.agreesWith] || d.agreesWith}</div>
      <div class="debate-quote">${d.agreementReason || "Withheld comment"}</div>
    </div>`).join("")}
  </div>
  <div class="divider"></div>
  ` : ""}

  <!-- §05 What Would Have Saved It -->
  <div class="section">
    <div class="section-num">§05</div>
    <div class="section-title">What would have saved it</div>
    ${report.whatWouldHaveSavedIt.map((item, i) => `
    <div class="list-item">
      <div class="list-num">${String(i + 1).padStart(2, "0")}</div>
      <div class="list-text-serif">${item}</div>
    </div>`).join("")}
  </div>

  <div class="divider"></div>

  <!-- §06 Lessons for Builders -->
  <div class="section">
    <div class="section-num">§06</div>
    <div class="section-title">Lessons for builders</div>
    ${report.lessonsForBuilders.map((item, i) => `
    <div class="list-item">
      <div class="list-num">${String(i + 1).padStart(2, "0")}</div>
      <div class="list-text-serif">${item}</div>
    </div>`).join("")}
  </div>

  <div class="divider"></div>

  <!-- §07 Pivotal Disagreement -->
  ${mcd ? `
  <div class="section">
    <div class="section-num">§07</div>
    <div class="section-title">Pivotal disagreement</div>
    <div class="pivotal">
      <div class="pivotal-agents">${agentNames[mcd.agentA] || mcd.agentA} vs ${agentNames[mcd.agentB] || mcd.agentB}</div>
      <div class="pivotal-topic">${mcd.topic}</div>
      <div class="pivotal-verdict">${mcd.whoseRightAndWhy}</div>
    </div>
  </div>
  ` : disagreements.length > 0 ? `
  <div class="section">
    <div class="section-num">§07</div>
    <div class="section-title">Agent disagreements</div>
    ${disagreements.map((d) => `
    <div class="disagreement-grid">
      <div class="dis-topic">${d.topic}</div>
      <div>
        <div class="dis-agent">${agentNames[d.agentA] || d.agentA}</div>
        <div class="dis-pos">${d.agentAPosition}</div>
      </div>
      <div>
        <div class="dis-agent">${agentNames[d.agentB] || d.agentB}</div>
        <div class="dis-pos">${d.agentBPosition}</div>
      </div>
    </div>`).join("")}
  </div>
  ` : ""}

  <div class="footer">Autopsy · 6 AI Agents · 1 Verdict · autopsy-nine.vercel.app</div>
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

const sectionFade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "linear" as const },
};

export function FinalVerdict({ report, onExploreCounterfactual }: FinalVerdictProps) {
  const doneAgents = report.agentFindings.filter((f) => f.status === "done");
  const debateItems = report.debateRound || [];
  const mcd = report.mostConsequentialDisagreement;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: "linear" }}
      className="mx-auto max-w-5xl divide-y divide-[rgba(255,255,255,0.1)]"
    >
      {/* §01 Primary Cause of Death */}
      <motion.section {...sectionFade} className="py-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#4B4BA0]">§01</span>
          <span className="text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
            Primary cause of death
          </span>
        </div>
        <p
          className="text-2xl leading-snug text-[white] sm:text-3xl lg:text-4xl"
          style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
        >
          {report.primaryCauseOfDeath}
        </p>
        <div className="mt-6 max-w-md">
          <span className="text-[10px] text-[#A1A1AA]">Confidence</span>
          <div className="mt-1.5">
            <ConfidenceBar value={report.confidenceScore} />
          </div>
        </div>
      </motion.section>

      {/* §02 Executive Summary */}
      <motion.section
        {...sectionFade}
        transition={{ ...sectionFade.transition, delay: 0.15 }}
        className="py-10"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#4B4BA0]">§02</span>
          <span className="text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
            Executive summary
          </span>
        </div>
        <p
          className="max-w-3xl text-base leading-7 text-[#A1A1AA] sm:text-lg sm:leading-8"
          style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
        >
          {report.executiveSummary}
        </p>
      </motion.section>

      {/* §03 Agent Findings */}
      <motion.section
        {...sectionFade}
        transition={{ ...sectionFade.transition, delay: 0.25 }}
        className="py-10"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#4B4BA0]">§03</span>
          <span className="text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
            Agent findings
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {doneAgents.map((f, i) => (
            <motion.div
              key={f.role}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.25, ease: "linear" }}
              className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-[white]">{f.displayName}</span>
                <span className="font-mono text-xs text-[#A1A1AA]">
                  {Math.round(f.confidence * 100)}%
                </span>
              </div>
              <p className="text-sm text-[#A1A1AA]">{f.primaryCause}</p>
              {f.fullAnalysis && (
                <p className="mt-3 border-t border-[rgba(255,255,255,0.1)] pt-3 text-xs leading-5 text-[#A1A1AA]">
                  {f.fullAnalysis.length > 200
                    ? f.fullAnalysis.slice(0, 200) + "..."
                    : f.fullAnalysis}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* §04 Debate Room */}
      {debateItems.length > 0 && (
        <motion.section
          {...sectionFade}
          transition={{ ...sectionFade.transition, delay: 0.35 }}
          className="py-10"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#4B4BA0]">§04</span>
            <span className="text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
              Debate room
            </span>
            <Swords className="h-3 w-3 text-[#4B4BA0]" />
          </div>
          <div className="space-y-4">
            {debateItems.map((d, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={d.agentRole}
                  initial={{ opacity: 0, x: isEven ? -12 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.25, ease: "linear" }}
                  className={isEven ? "" : "ml-6 sm:ml-12"}
                >
                  <p className="text-xs font-medium text-[#4B4BA0]">
                    {agentNames[d.agentRole]} disagrees with {agentNames[d.disagreesWith]}
                  </p>
                  {d.disagreementReason ? (
                    <p
                      className="mt-1 text-sm italic text-[white]"
                      style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
                    >
                      &ldquo;{d.disagreementReason}&rdquo;
                    </p>
                  ) : (
                    <p className="mt-1 text-xs italic text-[#A1A1AA]">Agent withheld comment</p>
                  )}
                  <div className="my-2 h-px bg-[rgba(255,255,255,0.1)]" />
                  <p className="text-xs font-medium text-[#00A67E]">
                    {agentNames[d.agentRole]} agrees with {agentNames[d.agreesWith]}
                  </p>
                  {d.agreementReason ? (
                    <p
                      className="mt-1 text-sm italic text-[#A1A1AA]"
                      style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
                    >
                      &ldquo;{d.agreementReason}&rdquo;
                    </p>
                  ) : (
                    <p className="mt-1 text-xs italic text-[#A1A1AA]">Agent withheld comment</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* §05 What Would Have Saved It */}
      <motion.section
        {...sectionFade}
        transition={{ ...sectionFade.transition, delay: 0.45 }}
        className="py-10"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#00A67E]">§05</span>
          <span className="text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
            What would have saved it
          </span>
        </div>
        <ul className="space-y-4">
          {report.whatWouldHaveSavedIt.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.25, ease: "linear" }}
              className="flex items-start gap-3"
            >
              <span className="font-mono text-xs font-bold text-[#00A67E]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-sm leading-6 text-[#A1A1AA]"
                style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              >
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.section>

      {/* §06 Lessons for Builders */}
      <motion.section
        {...sectionFade}
        transition={{ ...sectionFade.transition, delay: 0.55 }}
        className="py-10"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#A1A1AA]">§06</span>
          <span className="text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
            Lessons for builders
          </span>
        </div>
        <ol className="space-y-4">
          {report.lessonsForBuilders.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.25, ease: "linear" }}
              className="flex items-start gap-3"
            >
              <span className="font-mono text-xs font-bold text-[#A1A1AA]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-sm leading-6 text-[#A1A1AA]"
                style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              >
                {item}
              </span>
            </motion.li>
          ))}
        </ol>
      </motion.section>

      {/* §07 Pivotal Disagreement */}
      {(mcd || report.disagreements.length > 0) && (
        <motion.section
          {...sectionFade}
          transition={{ ...sectionFade.transition, delay: 0.65 }}
          className="py-10"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#4B4BA0]">§07</span>
            <span className="text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
              {mcd ? "Pivotal disagreement" : "Agent disagreements"}
            </span>
          </div>

          {mcd && (
            <div className="rounded-lg border border-[#4B4BA0]/40 bg-[#4B4BA0]/5 p-6">
              <p className="font-mono text-xs text-[#4B4BA0]">
                {agentNames[mcd.agentA] || mcd.agentA} vs {agentNames[mcd.agentB] || mcd.agentB}
              </p>
              <p
                className="mt-2 text-lg text-[white]"
                style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              >
                {mcd.topic}
              </p>
              <div className="mt-3 border-t border-[rgba(255,255,255,0.1)] pt-3">
                <p className="text-sm leading-6 text-[#A1A1AA]">
                  <span className="font-mono text-xs text-[#4B4BA0]">Verdict:</span>{" "}
                  {mcd.whoseRightAndWhy}
                </p>
              </div>
            </div>
          )}

          {!mcd && report.disagreements.length > 0 && (
            <div className="space-y-4">
              {report.disagreements.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.25, ease: "linear" }}
                  className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-5"
                >
                  <p className="text-xs text-[#A1A1AA]">{d.topic}</p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md border border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-4">
                      <p className="text-xs font-medium text-[#A1A1AA]">
                        {agentNames[d.agentA] || d.agentA}
                      </p>
                      <p
                        className="mt-1 text-sm text-[#A1A1AA]"
                        style={{
                          fontFamily: "var(--font-serif), Georgia, serif",
                        }}
                      >
                        {d.agentAPosition}
                      </p>
                    </div>
                    <div className="rounded-md border border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-4">
                      <p className="text-xs font-medium text-[#A1A1AA]">
                        {agentNames[d.agentB] || d.agentB}
                      </p>
                      <p
                        className="mt-1 text-sm text-[#A1A1AA]"
                        style={{
                          fontFamily: "var(--font-serif), Georgia, serif",
                        }}
                      >
                        {d.agentBPosition}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* §08 Explore Counterfactual */}
      {onExploreCounterfactual && (
        <motion.section
          {...sectionFade}
          transition={{ ...sectionFade.transition, delay: 0.75 }}
          className="py-10"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#8F47AE]">§08</span>
            <span className="text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
              Explore counterfactual
            </span>
          </div>
          <button
            onClick={onExploreCounterfactual}
            className="group inline-flex items-center gap-2 rounded-lg border border-[#8F47AE]/30 bg-[#8F47AE]/5 px-5 py-3 text-sm text-[#8F47AE] transition-colors hover:border-[#8F47AE] hover:bg-[#8F47AE]/10"
          >
            What if {report.subject} had made a different decision?
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.section>
      )}

      {/* Download */}
      <div className="flex justify-end py-8">
        <button
          onClick={() => generatePDF(report)}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-[#3F3F3F] bg-[#0F1110] px-4 text-sm text-[#A1A1AA] transition-colors hover:border-[#4B4BA0] hover:text-[white]"
        >
          <FileDown className="h-4 w-4" />
          Download report (PDF)
        </button>
      </div>
    </motion.div>
  );
}
