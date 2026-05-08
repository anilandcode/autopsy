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
  synthesizer: "Synthesizer",
};

interface DebateRoomV2Props {
  debate: AgentDebateOutput[];
}

export function DebateRoomV2({ debate }: DebateRoomV2Props) {
  if (debate.length === 0) return null;

  return (
    <div className="mx-auto max-w-5xl pt-12">
      <div className="mb-6 flex items-center gap-3">
        <Swords className="h-4 w-4 text-[#81B09A]" />
        <h3
          className="font-mono text-lg uppercase tracking-[0.1em] text-[#3C3A39]"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          &sect;02 &mdash; DEBATE ROUND
        </h3>
      </div>

      <div className="space-y-4">
        {debate.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.08 }}
            className="overflow-hidden rounded-[20px] border border-[#E5E2DD] bg-white p-5"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#C6DACC] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#3C3A39]">
                {agentNames[d.agentRole]}
              </span>
              {d.disagreesWith && (
                <span className="text-xs text-[#A0A09E]">
                  disagrees with{" "}
                  <span className="font-mono text-[10px] text-[#6B6A69]">
                    {agentNames[d.disagreesWith]}
                  </span>
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#3C3A39]">
              {d.disagreementReason}
            </p>
            {d.agreesWith && d.agreementReason && (
              <div className="mt-3 border-t border-[#E5E2DD] pt-3">
                <span className="text-xs text-[#A0A09E]">
                  Agrees with{" "}
                  <span className="font-mono text-[10px] text-[#6B6A69]">
                    {agentNames[d.agreesWith]}
                  </span>
                  :
                </span>
                <p className="mt-1 text-sm leading-relaxed text-[#6B6A69]">
                  {d.agreementReason}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
