"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AgentCard } from "./agent-card";
import type { AgentRole, AgentStatus, AgentFinding } from "@/types/investigation";

interface CorkboardProps {
  subject: string;
  agentRoles: AgentRole[];
  agentFindings: Record<AgentRole, AgentFinding | null>;
  agentStatuses: Record<AgentRole, AgentStatus>;
  onCancel?: () => void;
}

export function Corkboard({
  subject,
  agentRoles,
  agentFindings,
  agentStatuses,
  onCancel,
}: CorkboardProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EF4444] opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#EF4444]" />
          </span>
          <h2 className="text-lg font-semibold text-[#FAFAFA]">
            Investigating: <span className="text-[#EF4444]">{subject}</span>
          </h2>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#EF4444]/30 px-3 text-xs font-medium text-[#EF4444] transition-colors hover:bg-[#EF4444]/10"
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
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
