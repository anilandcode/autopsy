"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  UserCog,
  DollarSign,
  MessageSquareQuote,
  Code2,
  History,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CircleDot,
  Search,
} from "lucide-react";
import type { AgentRole, AgentStatus } from "@/types/investigation";

const agentConfig: Record<
  AgentRole,
  { name: string; icon: React.ElementType; color: string }
> = {
  "market-analyst": { name: "Market Analyst", icon: BarChart3, color: "#EF4444" },
  operator: { name: "The Operator", icon: UserCog, color: "#F97316" },
  "money-trail": { name: "Money Trail", icon: DollarSign, color: "#22C55E" },
  "customer-voice": { name: "Customer Voice", icon: MessageSquareQuote, color: "#3B82F6" },
  engineer: { name: "The Engineer", icon: Code2, color: "#A855F7" },
  historian: { name: "The Historian", icon: History, color: "#EAB308" },
  synthesizer: { name: "The Synthesizer", icon: CheckCircle2, color: "#EF4444" },
};

const statusConfig: Record<
  AgentStatus,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  idle: { label: "Idle", bg: "bg-[#222222]", text: "text-[#71717A]", icon: CircleDot },
  researching: {
    label: "Researching",
    bg: "bg-[#EF4444]/10",
    text: "text-[#EF4444]",
    icon: Search,
  },
  analyzing: {
    label: "Analyzing",
    bg: "bg-[#F97316]/10",
    text: "text-[#F97316]",
    icon: Loader2,
  },
  done: { label: "Done", bg: "bg-[#22C55E]/10", text: "text-[#22C55E]", icon: CheckCircle2 },
  error: { label: "Error", bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", icon: AlertCircle },
};

interface AgentCardProps {
  role: AgentRole;
  status: AgentStatus;
  primaryCause?: string;
  confidence?: number;
  analysis?: string;
  index: number;
}

export function AgentCard({
  role,
  status,
  primaryCause,
  confidence,
  analysis,
  index,
}: AgentCardProps) {
  const config = agentConfig[role];
  const StatusIcon = statusConfig[status].icon;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex flex-col rounded-xl border border-[#222222] bg-[#111111] p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md"
            style={{ backgroundColor: `${config.color}15`, color: config.color }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-[#FAFAFA]">
            {config.name}
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[status].bg} ${statusConfig[status].text}`}
        >
          <StatusIcon
            className={`h-3 w-3 ${status === "researching" || status === "analyzing" ? "animate-spin" : ""}`}
          />
          {statusConfig[status].label}
        </div>
      </div>

      {status === "researching" && (
        <div className="mt-2 space-y-2">
          <div className="h-3 w-3/4 animate-pulse rounded bg-[#222222]" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-[#222222]" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-[#222222]" />
        </div>
      )}

      {status === "analyzing" && (
        <div className="mt-2 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-[#222222]" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-[#222222]" />
        </div>
      )}

      {(status === "done" || status === "error") && (
        <>
          {primaryCause && (
            <div className="mb-2 text-sm font-medium text-[#FAFAFA]">
              {primaryCause}
            </div>
          )}
          {typeof confidence === "number" && (
            <div className="mb-3">
              <div className="mb-1 flex items-center justify-between text-xs text-[#71717A]">
                <span>Confidence</span>
                <span>{Math.round(confidence * 100)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#222222]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                      confidence > 0.7
                        ? "#22C55E"
                        : confidence > 0.4
                          ? "#F97316"
                          : "#EF4444",
                  }}
                />
              </div>
            </div>
          )}
          {analysis && (
            <p className="max-h-32 overflow-y-auto text-xs leading-5 text-[#71717A]">
              {analysis}
            </p>
          )}
        </>
      )}

      {status === "idle" && (
        <p className="text-xs text-[#52525B]">Waiting for signal...</p>
      )}
    </motion.div>
  );
}
