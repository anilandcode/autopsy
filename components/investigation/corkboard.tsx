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
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-none bg-[#D62828] opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-none bg-[#D62828]" />
          </span>
          <h3 className="font-mono text-lg uppercase tracking-[0.1em] text-[#F4F1EA]">
            &sect;01 &mdash;{" "}
            {mode === "founder" ? "FOUNDER MODE:" : mode === "premortem" ? "PRE-MORTEM:" : mode === "counterfactual" ? "COUNTERFACTUAL:" : "INVESTIGATING:"}{" "}
            <span className={mode === "founder" ? "text-[#06D6A0]" : mode === "premortem" ? "text-[#FFD60A]" : mode === "counterfactual" ? "text-[#FACC15]" : "text-[#D62828]"}>{subject}</span>
          </h3>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="inline-flex h-8 items-center gap-1.5 border border-[#D62828]/30 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#D62828] transition-colors hover:bg-[#D62828]/10"
          >
            <X className="h-3.5 w-3.5" />
            CANCEL
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
