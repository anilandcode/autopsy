"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AgentCard } from "./agent-card";
import type { AgentRole, AgentStatus, AgentFinding, PremortemFinding, FounderFinding, CounterfactualAgentFinding, InvestigationMode } from "@/types/investigation";

interface CorkboardProps {
  subject: string;
  agentRoles: AgentRole[];
  agentFindings: Record<AgentRole, AgentFinding | null>;
  premortemFindings: Record<AgentRole, PremortemFinding | null>;
  founderFindings: Record<AgentRole, FounderFinding | null>;
  counterfactualFindings: Record<AgentRole, CounterfactualAgentFinding | null>;
  agentStatuses: Record<AgentRole, AgentStatus>;
  mode: InvestigationMode;
  deep: boolean;
  onCancel?: () => void;
}

export function Corkboard({
  subject,
  agentRoles,
  agentFindings,
  premortemFindings,
  founderFindings,
  counterfactualFindings,
  agentStatuses,
  mode,
  deep,
  onCancel,
}: CorkboardProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "linear" }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4B4BA0] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4B4BA0]" />
          </span>
          <h3 className="text-base font-medium text-[white]">
            {mode === "founder" ? "Founder mode: " : mode === "premortem" ? "Pre-mortem: " : mode === "counterfactual" ? "Counterfactual: " : "Investigating: "}
            <span className={mode === "founder" ? "text-[#06D6A0]" : mode === "premortem" ? "text-[#FFD60A]" : mode === "counterfactual" ? "text-[#FACC15]" : "text-[#4B4BA0]"}>{subject}</span>
            {deep && (
              <span className="ml-2 rounded-full bg-[#4B4BA0]/10 px-2 py-0.5 text-[10px] font-medium text-[#4B4BA0]">
                Deep mode
              </span>
            )}
          </h3>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#4B4BA0]/30 px-3 text-[10px] font-medium text-[#4B4BA0] transition-colors hover:bg-[#4B4BA0]/10"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        )}
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agentRoles.map((role, i) => (
          <AgentCard
            key={role}
            role={role}
            status={agentStatuses[role]}
            finding={agentFindings[role]}
            premortemFinding={premortemFindings[role]}
            founderFinding={founderFindings[role]}
            counterfactualFinding={counterfactualFindings[role]}
            index={i}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
}
