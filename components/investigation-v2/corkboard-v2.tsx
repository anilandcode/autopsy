"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AgentCardV2 } from "./agent-card-v2";
import type { AgentRole, AgentStatus, AgentFinding, PremortemFinding, FounderFinding, InvestigationMode } from "@/types/investigation";

interface CorkboardV2Props {
  subject: string;
  agentRoles: AgentRole[];
  agentFindings: Record<AgentRole, AgentFinding | null>;
  premortemFindings: Record<AgentRole, PremortemFinding | null>;
  founderFindings: Record<AgentRole, FounderFinding | null>;
  agentStatuses: Record<AgentRole, AgentStatus>;
  mode: InvestigationMode;
  onCancel?: () => void;
}

export function CorkboardV2({
  subject,
  agentRoles,
  agentFindings,
  premortemFindings,
  founderFindings,
  agentStatuses,
  mode,
  onCancel,
}: CorkboardV2Props) {
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
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#81B09A] opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#81B09A]" />
          </span>
          <h3
            className="font-mono text-lg uppercase tracking-[0.1em] text-[#3C3A39]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            &sect;01 &mdash;{" "}
            {mode === "founder" ? "FOUNDER MODE:" : mode === "premortem" ? "PRE-MORTEM:" : "INVESTIGATING:"}{" "}
            <span className={mode === "founder" ? "text-[#4A9B7F]" : mode === "premortem" ? "text-[#8B7A3A]" : "text-[#81B09A]"}>
              {subject}
            </span>
          </h3>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-[#E5E2DD] px-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B6A69] transition-colors hover:border-[#B85C38] hover:text-[#B85C38]"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        )}
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agentRoles.map((role, i) => (
          <AgentCardV2
            key={role}
            role={role}
            status={agentStatuses[role]}
            finding={agentFindings[role]}
            premortemFinding={premortemFindings[role]}
            founderFinding={founderFindings[role]}
            index={i}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
}
