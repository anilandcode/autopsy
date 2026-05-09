"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { CounterfactualReport, CounterfactualVerdict } from "@/types/investigation";

interface CounterfactualVerdictProps {
  report: CounterfactualReport;
  onExploreCounterfactual?: () => void;
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
        <span className="animate-pulse text-[#FACC15]">|</span>
      )}
    </span>
  );
}

const verdictColors: Record<CounterfactualVerdict, { bg: string; text: string }> = {
  "would-have-survived": { bg: "bg-[#06D6A0]", text: "text-[#0E0E0E]" },
  "would-have-delayed-failure": { bg: "bg-[#FFD60A]", text: "text-[#0E0E0E]" },
  "would-have-failed-differently": { bg: "bg-[#F97316]", text: "text-[#0E0E0E]" },
  "would-have-made-no-difference": { bg: "bg-[#3F3F3F]", text: "text-[#B8B5AE]" },
  "could-have-transformed-the-company": { bg: "bg-[#D62828]", text: "text-white" },
};

export function CounterfactualVerdictComponent({ report }: CounterfactualVerdictProps) {
  const vc = verdictColors[report.verdict] || verdictColors["would-have-made-no-difference"];
  const delta = report.probabilityDelta;
  const deltaColor = delta > 0 ? "text-[#06D6A0]" : delta < 0 ? "text-[#D62828]" : "text-[#71706B]";

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
          &sect;03 &mdash; COUNTERFACTUAL VERDICT
        </h3>
      </motion.div>

      {/* Probability shift panel */}
      <div className="border-2 border-[#3F3F3F] bg-[#161616] p-6 sm:p-8">
        {/* Classification stamp */}
        <div className="mb-6 flex justify-end">
          <span
            className="font-mono text-[10px] uppercase tracking-widest text-[#FACC15]"
            style={{ transform: "rotate(4deg)", display: "inline-block" }}
          >
            CLASSIFICATION: ALTERNATE HISTORY
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
          <div className="border border-[#2A2A2A] bg-[#0E0E0E] p-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#71706B]">
              Actual Survival Probability
            </p>
            <p className="mt-3 text-5xl font-bold text-[#5C5852]" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
              {report.survivalProbabilityActual}%
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#5C5852] line-clamp-2">
              {report.originalDecision}
            </p>
          </div>

          {/* Center — Arrow + delta */}
          <div className="flex flex-col items-center justify-center gap-1 py-2 sm:px-4">
            <span className="text-3xl text-[#3F3F3F]">→</span>
            <span className={`font-mono text-lg font-bold ${deltaColor}`}>
              {delta > 0 ? "+" : ""}{delta} PTS
            </span>
          </div>

          {/* Right — Alternate */}
          <div className="border border-[#2A2A2A] bg-[#0E0E0E] p-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#71706B]">
              With Alternate Decision
            </p>
            <p className={`mt-3 text-5xl font-bold ${delta > 0 ? "text-[#06D6A0]" : "text-[#D62828]"}`} style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
              {report.survivalProbabilityAlternate}%
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#FACC15] line-clamp-2">
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
          <div className={`${vc.bg} ${vc.text} px-6 py-4 text-center`}>
            <p className="font-mono text-sm font-bold uppercase tracking-[0.2em]">
              {report.verdictLabel || report.verdict.replace(/-/g, " ").toUpperCase()}
            </p>
          </div>
        </motion.div>

        {/* Agent vote tally */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 border-t border-[#2A2A2A] pt-6"
        >
          <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#F4F1EA]">
            Agent Votes
          </p>
          <div className="mt-3 flex items-center gap-1">
            {report.agentsWhoThinkItHelps.map((role, i) => (
              <div key={`y-${i}`} className="h-4 w-8 bg-[#06D6A0]" title={role} />
            ))}
            {report.agentsWhoThinkItDoesntMatter.map((role, i) => (
              <div key={`n-${i}`} className="h-4 w-8 bg-[#D62828]" title={role} />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#06D6A0]">
                {report.agentsWhoThinkItHelps.length} agent{report.agentsWhoThinkItHelps.length !== 1 ? "s" : ""} say the change would have helped
              </p>
              <div className="mt-1 space-y-0.5">
                {report.agentsWhoThinkItHelps.map((r) => (
                  <p key={r} className="font-mono text-[10px] text-[#B8B5AE]">▸ {r}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#D62828]">
                {report.agentsWhoThinkItDoesntMatter.length} agent{report.agentsWhoThinkItDoesntMatter.length !== 1 ? "s" : ""} say it wouldn&apos;t have mattered
              </p>
              <div className="mt-1 space-y-0.5">
                {report.agentsWhoThinkItDoesntMatter.map((r) => (
                  <p key={r} className="font-mono text-[10px] text-[#B8B5AE]">▸ {r}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Executive summary */}
        <div className="relative mt-6 border-t border-[#2A2A2A] pt-6">
          <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#5C5852]">
            Executive Summary
          </p>
          <p
            className="mt-3 text-lg leading-8 text-[#B8B5AE]"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            <TypewriterText text={report.executiveSummary} speed={15} />
          </p>
        </div>

        {/* Key insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 border-2 border-[#FACC15] bg-[#0E0E0E] p-6"
        >
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#FACC15]">
            ⚡ KEY INSIGHT
          </p>
          <p
            className="mt-3 text-2xl leading-8 text-[#F4F1EA]"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}
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
            className="mt-6 border-t border-[#2A2A2A] pt-6"
          >
            <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#F97316]">
              Unintended Consequences of the Alternate Decision
            </p>
            <div className="mt-4 space-y-3">
              {report.butterflyEffects.map((effect, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="border border-[#2A2A2A] bg-[#0E0E0E] p-4"
                >
                  <p className="text-sm text-[#B8B5AE]">
                    <span className="font-mono text-xs text-[#F97316]">IF </span>
                    <span style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
                      {report.alternateDecision}
                    </span>
                    <span className="font-mono text-xs text-[#F97316]"> → THEN </span>
                    <span style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
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
            className="mt-6 border-t border-[#2A2A2A] pt-6"
          >
            <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#5C5852]">
              Real Companies That Made Similar Pivots
            </p>
            <div className="mt-4 space-y-2">
              {report.historicalParallels.map((parallel, i) => (
                <p key={i} className="text-sm text-[#B8B5AE]">
                  <span className="font-mono text-xs text-[#FACC15]">CASE STUDY: </span>
                  <span style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
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
