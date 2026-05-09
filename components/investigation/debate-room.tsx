"use client";

import { motion } from "framer-motion";
import { Swords } from "lucide-react";
import type { AgentDebateOutput, AgentRole } from "@/types/investigation";

const agentNames: Record<AgentRole, string> = {
  "market-analyst": "Market Analyst",
  operator: "The Operator",
  "money-trail": "Money Trail",
  "customer-voice": "Customer Voice",
  engineer: "The Engineer",
  historian: "The Historian",
  synthesizer: "The Synthesizer",
};

interface DebateRoomProps {
  debate: AgentDebateOutput[];
}

export function DebateRoom({ debate }: DebateRoomProps) {
  if (debate.length === 0) return null;

  return (
    <div className="mx-auto max-w-5xl pt-12">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "linear" }}
        className="mb-8 flex items-center gap-3"
      >
        <Swords className="h-4 w-4 text-[#D62828]" />
        <h3 className="text-base font-medium text-[#F4F1EA]">
          Agent debate
        </h3>
      </motion.div>

      {/* Agent debate rows */}
      <div className="space-y-0">
        {debate.map((d, i) => {
          const isEven = i % 2 === 0;
          return (
            <motion.div
              key={d.agentRole}
              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.25,
                delay: i * 0.2,
                ease: "linear",
              }}
              className={`${isEven ? "ml-0" : "ml-8 sm:ml-16"} my-4`}
            >
              {/* Disagreement */}
              <p className="text-xs text-[#D62828]">
                {agentNames[d.agentRole]} disagrees with {agentNames[d.disagreesWith]}
              </p>
              <p
                className="mt-1 text-base italic text-[#F4F1EA]"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                &ldquo;{d.disagreementReason}&rdquo;
              </p>

              {/* Thin horizontal rule */}
              <div className="my-3 h-px bg-[#2A2A2A]" />

              {/* Agreement */}
              <p className="text-xs text-[#06D6A0]">
                {agentNames[d.agentRole]} agrees with {agentNames[d.agreesWith]}
              </p>
              <p
                className="mt-1 text-base italic text-[#B8B5AE]"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                &ldquo;{d.agreementReason}&rdquo;
              </p>

              {/* Divider between debates (not after last) */}
              {i < debate.length - 1 && (
                <div className="my-4 h-px bg-[#2A2A2A]" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
