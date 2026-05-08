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
        <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#222222] bg-[#111111] px-4 text-sm text-[#71717A] transition-colors hover:border-[#EF4444]/30 hover:text-[#FAFAFA]">
          <FileDown className="h-4 w-4" />
          Download Report (PDF)
        </button>
      </div>
    </motion.div>
  );
}
