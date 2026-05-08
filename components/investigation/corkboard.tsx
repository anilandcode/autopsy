"use client";

import { motion } from "framer-motion";
import { AgentCard } from "./agent-card";
import type { AgentFinding } from "@/types/investigation";

interface CorkboardProps {
  subject: string;
  findings: AgentFinding[];
}

export function Corkboard({ subject, findings }: CorkboardProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 flex items-center gap-3"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EF4444] opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#EF4444]" />
        </span>
        <h2 className="text-lg font-semibold text-[#FAFAFA]">
          Investigating: <span className="text-[#EF4444]">{subject}</span>
        </h2>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {findings.map((finding, i) => (
          <AgentCard
            key={finding.role}
            role={finding.role}
            status={finding.status}
            primaryCause={finding.primaryCause}
            confidence={finding.confidence}
            analysis={finding.fullAnalysis}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
