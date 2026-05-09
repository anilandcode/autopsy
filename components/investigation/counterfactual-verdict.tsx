"use client";

import { motion } from "framer-motion";
import type { CounterfactualReport, CounterfactualVerdict } from "@/types/investigation";

interface CounterfactualVerdictProps {
  report: CounterfactualReport;
  onExploreCounterfactual?: () => void;
}

const verdictColors: Record<CounterfactualVerdict, { bg: string; text: string }> = {
  "would-have-survived": { bg: "bg-[#00A67E]", text: "text-[#0F1110]" },
  "would-have-delayed-failure": { bg: "bg-[#8F47AE]", text: "text-[#0F1110]" },
  "would-have-failed-differently": { bg: "bg-[#F97316]", text: "text-[#0F1110]" },
  "would-have-made-no-difference": { bg: "bg-[rgba(255,255,255,0.1)]", text: "text-[#A1A1AA]" },
  "could-have-transformed-the-company": { bg: "bg-[#4B4BA0]", text: "text-white" },
};

export function CounterfactualVerdictComponent({ report }: CounterfactualVerdictProps) {
  const vc = verdictColors[report.verdict] || verdictColors["would-have-made-no-difference"];
  const delta = report.probabilityDelta;
  const deltaColor = delta > 0 ? "text-[#00A67E]" : delta < 0 ? "text-[#4B4BA0]" : "text-[#A1A1AA]";

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
        <h3 className="text-base font-medium text-[white]">Counterfactual verdict</h3>
      </motion.div>

      {/* Probability shift panel */}
      <div className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-medium text-[white]">{report.subject}</h2>
            <p className="mt-1 text-xs text-[#A1A1AA]">
              {new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <span className="rounded-full bg-[#8F47AE]/10 px-3 py-1 text-[10px] font-medium text-[#8F47AE]">
            Counterfactual
          </span>
        </div>

        {/* The Probability Shift */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.3 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
        >
          {/* Left — Actual */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-6 text-center">
            <p className="text-[10px] text-[#A1A1AA]">Actual survival probability</p>
            <p className="mt-3 text-4xl font-bold text-[#5C5852]" style={{ fontFamily: "var(--font-serif), Georgia, serif" }}>
              {report.survivalProbabilityActual}%
            </p>
            <p className="mt-2 line-clamp-2 text-[10px] text-[#5C5852]">
              {report.originalDecision}
            </p>
          </div>

          {/* Center — Arrow + delta */}
          <div className="flex flex-col items-center justify-center gap-1 py-2 sm:px-4">
            <span className="text-3xl text-[rgba(255,255,255,0.1)]">&rarr;</span>
            <span className={`text-lg font-bold ${deltaColor}`}>
              {delta > 0 ? "+" : ""}{delta} pts
            </span>
          </div>

          {/* Right — Alternate */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-6 text-center">
            <p className="text-[10px] text-[#A1A1AA]">With alternate decision</p>
            <p className={`mt-3 text-4xl font-bold ${delta > 0 ? "text-[#00A67E]" : "text-[#4B4BA0]"}`} style={{ fontFamily: "var(--font-serif), Georgia, serif" }}>
              {report.survivalProbabilityAlternate}%
            </p>
            <p className="mt-2 line-clamp-2 text-[10px] text-[#8F47AE]">
              {report.alternateDecision}
            </p>
          </div>
        </motion.div>

        {/* Verdict badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className={`${vc.bg} ${vc.text} rounded-lg px-6 py-4 text-center`}>
            <p className="text-sm font-bold">
              {report.verdictLabel || report.verdict.replace(/-/g, " ")}
            </p>
          </div>
        </motion.div>

        {/* Agent vote tally */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 border-t border-[rgba(255,255,255,0.1)] pt-6"
        >
          <p className="text-xs text-[white]">Agent votes</p>
          <div className="mt-3 flex items-center gap-1">
            {report.agentsWhoThinkItHelps.map((role, i) => (
              <div key={`y-${i}`} className="h-4 w-8 rounded bg-[#00A67E]" title={role} />
            ))}
            {report.agentsWhoThinkItDoesntMatter.map((role, i) => (
              <div key={`n-${i}`} className="h-4 w-8 rounded bg-[#4B4BA0]" title={role} />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-[#00A67E]">
                {report.agentsWhoThinkItHelps.length} agent{report.agentsWhoThinkItHelps.length !== 1 ? "s" : ""} say the change would have helped
              </p>
              <div className="mt-1 space-y-0.5">
                {report.agentsWhoThinkItHelps.map((r) => (
                  <p key={r} className="text-[10px] text-[#A1A1AA]">{r}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[#4B4BA0]">
                {report.agentsWhoThinkItDoesntMatter.length} agent{report.agentsWhoThinkItDoesntMatter.length !== 1 ? "s" : ""} say it wouldn&apos;t have mattered
              </p>
              <div className="mt-1 space-y-0.5">
                {report.agentsWhoThinkItDoesntMatter.map((r) => (
                  <p key={r} className="text-[10px] text-[#A1A1AA]">{r}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Executive summary */}
        <div className="mt-6 border-t border-[rgba(255,255,255,0.1)] pt-6">
          <p className="text-xs text-[#5C5852]">Executive summary</p>
          <p
            className="mt-3 text-base leading-7 text-[#A1A1AA]"
            style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
          >
            {report.executiveSummary}
          </p>
        </div>

        {/* Key insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 rounded-lg border border-[#8F47AE] bg-[#0F1110] p-6"
        >
          <p className="text-xs text-[#8F47AE]">Key insight</p>
          <p
            className="mt-3 text-xl italic leading-8 text-[white]"
            style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
          >
            {report.keyInsight}
          </p>
        </motion.div>

        {/* Butterfly effects */}
        {report.butterflyEffects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 border-t border-[rgba(255,255,255,0.1)] pt-6"
          >
            <p className="text-xs text-[#F97316]">Unintended consequences of the alternate decision</p>
            <div className="mt-4 space-y-3">
              {report.butterflyEffects.map((effect, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-4"
                >
                  <p className="text-sm text-[#A1A1AA]">
                    <span className="text-xs text-[#F97316]">If </span>
                    <span style={{ fontFamily: "var(--font-serif), Georgia, serif" }}>
                      {report.alternateDecision}
                    </span>
                    <span className="text-xs text-[#F97316]"> then </span>
                    <span style={{ fontFamily: "var(--font-serif), Georgia, serif" }}>
                      {effect}
                    </span>
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Historical parallels */}
        {report.historicalParallels.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-6 border-t border-[rgba(255,255,255,0.1)] pt-6"
          >
            <p className="text-xs text-[#5C5852]">Real companies that made similar pivots</p>
            <div className="mt-4 space-y-2">
              {report.historicalParallels.map((parallel, i) => (
                <p key={i} className="text-sm text-[#A1A1AA]">
                  <span className="text-xs text-[#8F47AE]">Case study: </span>
                  <span style={{ fontFamily: "var(--font-serif), Georgia, serif" }}>
                    {parallel}
                  </span>
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
