"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type {
  AgentRole,
  AgentStatus,
  AgentFinding,
  PremortemFinding,
  FounderFinding,
  RiskLevel,
  InvestigationMode,
} from "@/types/investigation";

const agentConfig: Record<
  AgentRole,
  { displayName: string; icon: string; color: string }
> = {
  "market-analyst": { displayName: "Market Analyst", icon: "M", color: "#81B09A" },
  operator: { displayName: "The Operator", icon: "O", color: "#6A9580" },
  "money-trail": { displayName: "Money Trail", icon: "$", color: "#4A9B7F" },
  "customer-voice": { displayName: "Customer Voice", icon: "C", color: "#81B09A" },
  engineer: { displayName: "The Engineer", icon: "E", color: "#6A9580" },
  historian: { displayName: "The Historian", icon: "H", color: "#4A9B7F" },
  synthesizer: { displayName: "Synthesizer", icon: "S", color: "#81B09A" },
};

const statusConfig: Record<
  AgentStatus,
  { label: string; bg: string; text: string }
> = {
  idle: { label: "IDLE", bg: "#FEFCF5", text: "#A0A09E" },
  researching: { label: "RESEARCHING", bg: "#C6DACC", text: "#3C3A39" },
  analyzing: { label: "ANALYZING", bg: "#EDE6DB", text: "#3C3A39" },
  done: { label: "DONE", bg: "#81B09A", text: "#FFFFFF" },
  error: { label: "ERROR", bg: "#FEFCF5", text: "#D62828" },
};

const riskLevelConfig: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  low: { label: "LOW", color: "#4A9B7F", bg: "#C6DACC" },
  medium: { label: "MEDIUM", color: "#8B7A3A", bg: "#EDE6DB" },
  high: { label: "HIGH", color: "#B85C38", bg: "#F5E6DB" },
  critical: { label: "CRITICAL", color: "#A03030", bg: "#F5DBDB" },
};

interface AgentCardV2Props {
  role: AgentRole;
  status: AgentStatus;
  finding: AgentFinding | null;
  premortemFinding: PremortemFinding | null;
  founderFinding: FounderFinding | null;
  index: number;
  mode: InvestigationMode;
}

export function AgentCardV2({
  role,
  status,
  finding,
  premortemFinding,
  founderFinding,
  index,
  mode,
}: AgentCardV2Props) {
  const config = agentConfig[role];
  const activeFinding =
    mode === "premortem"
      ? premortemFinding
      : mode === "founder"
        ? founderFinding
        : finding;
  const activeRiskLevel: RiskLevel | null =
    mode === "premortem"
      ? premortemFinding?.riskLevel ?? null
      : mode === "founder"
        ? founderFinding?.severity ?? null
        : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      className="relative overflow-hidden rounded-[20px] border border-[#E5E2DD] bg-white transition-shadow hover:shadow-md"
    >
      {/* Top accent line for active/done agents */}
      <div
        className="h-1 w-full"
        style={{
          backgroundColor:
            status === "done" ? config.color : status !== "idle" ? `${config.color}40` : "#E5E2DD",
        }}
      />

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: config.color }}
            >
              {config.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#3C3A39]">
                {config.displayName}
              </p>
              {activeRiskLevel && (
                <span
                  className="mt-0.5 inline-block rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: riskLevelConfig[activeRiskLevel].bg,
                    color: riskLevelConfig[activeRiskLevel].color,
                  }}
                >
                  {riskLevelConfig[activeRiskLevel].label}
                </span>
              )}
            </div>
          </div>
          {status !== "idle" && (
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em]"
              style={{
                backgroundColor: statusConfig[status].bg,
                color: statusConfig[status].text,
              }}
            >
              {statusConfig[status].label}
            </span>
          )}
        </div>

        {/* Content */}
        {(status === "researching" || status === "analyzing") && !activeFinding && (
          <SkeletonLinesV2 />
        )}

        {status === "idle" && (
          <p className="text-xs text-[#A0A09E]">Awaiting deployment</p>
        )}

        {status === "error" && (
          <p className="text-xs text-[#D62828]">Agent encountered an error</p>
        )}

        {mode === "postmortem" && finding && <PostmortemCardContentV2 finding={finding} />}
        {mode === "premortem" && premortemFinding && (
          <PremortemCardContentV2 finding={premortemFinding} />
        )}
        {mode === "founder" && founderFinding && (
          <FounderCardContentV2 finding={founderFinding} />
        )}
      </div>
    </motion.div>
  );
}

function SkeletonLinesV2() {
  return (
    <div className="space-y-2 pt-1">
      <div className="h-3 w-3/4 animate-pulse rounded bg-[#E5E2DD]" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-[#E5E2DD]" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-[#E5E2DD]" />
    </div>
  );
}

function PostmortemCardContentV2({ finding }: { finding: AgentFinding }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = finding.fullAnalysis && finding.fullAnalysis.length > 200;

  return (
    <div className="pt-1">
      {finding.primaryCause && (
        <p className="mb-2 text-base font-medium leading-6 text-[#3C3A39]">
          {finding.primaryCause}
        </p>
      )}

      {finding.evidence.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {finding.evidence.map((ev, i) => (
            <p key={i} className="text-xs leading-5 text-[#6B6A69]">
              • {ev}
            </p>
          ))}
        </div>
      )}

      {typeof finding.confidence === "number" && (
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#A0A09E]">
            Confidence
          </span>
          <TerminalConfidenceBarV2 value={finding.confidence} />
        </div>
      )}

      {finding.fullAnalysis && (
        <>
          <p
            className={`text-sm leading-5 text-[#6B6A69] ${!expanded ? "line-clamp-4" : ""}`}
          >
            {finding.fullAnalysis}
          </p>
          {isLong && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#81B09A] transition-colors hover:text-[#6A9580]"
            >
              Read full analysis
            </button>
          )}
        </>
      )}

      {finding.sources && finding.sources.length > 0 && (
        <SourcesSectionV2 sources={finding.sources} />
      )}
    </div>
  );
}

function PremortemCardContentV2({ finding }: { finding: PremortemFinding }) {
  return (
    <div className="pt-1">
      {finding.topRisk && (
        <p className="mb-2 text-base font-medium leading-6 text-[#3C3A39]">
          Top Risk: {finding.topRisk}
        </p>
      )}

      {finding.evidence.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {finding.evidence.map((ev, i) => (
            <p key={i} className="text-xs leading-5 text-[#6B6A69]">
              • {ev}
            </p>
          ))}
        </div>
      )}

      {finding.fullAnalysis && (
        <p className="mb-3 line-clamp-4 text-sm leading-5 text-[#6B6A69]">
          {finding.fullAnalysis}
        </p>
      )}

      {finding.earlyWarnings.length > 0 && (
        <div className="border-t border-[#E5E2DD] pt-3">
          <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#81B09A]">
            Early Warnings to Watch
          </p>
          {finding.earlyWarnings.map((w, i) => (
            <p key={i} className="text-[11px] leading-5 text-[#6B6A69]">
              ▸ {w}
            </p>
          ))}
        </div>
      )}

      {finding.sources && finding.sources.length > 0 && (
        <SourcesSectionV2 sources={finding.sources} />
      )}
    </div>
  );
}

function FounderCardContentV2({ finding }: { finding: FounderFinding }) {
  return (
    <div className="pt-1">
      {finding.topFailureMode && (
        <p className="mb-2 text-base font-medium leading-6 text-[#3C3A39]">
          {finding.topFailureMode}
        </p>
      )}

      {finding.evidence.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {finding.evidence.map((ev, i) => (
            <p key={i} className="text-xs leading-5 text-[#6B6A69]">
              • {ev}
            </p>
          ))}
        </div>
      )}

      {finding.fullAnalysis && (
        <p className="mb-3 line-clamp-4 text-sm leading-5 text-[#6B6A69]">
          {finding.fullAnalysis}
        </p>
      )}

      {finding.mitigations && finding.mitigations.length > 0 && (
        <div className="border-t border-[#E5E2DD] pt-3">
          <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#4A9B7F]">
            Mitigations
          </p>
          {finding.mitigations.map((m, i) => (
            <p key={i} className="text-[11px] leading-5 text-[#6B6A69]">
              ▸ {m}
            </p>
          ))}
        </div>
      )}

      {finding.sources && finding.sources.length > 0 && (
        <SourcesSectionV2 sources={finding.sources} />
      )}
    </div>
  );
}

function SourcesSectionV2({
  sources,
}: {
  sources: { title: string; url: string }[];
}) {
  return (
    <div className="mt-3 border-t border-[#E5E2DD] pt-3">
      <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#A0A09E]">
        Sources
      </p>
      <div className="flex flex-col gap-1">
        {sources.slice(0, 4).map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#81B09A] transition-colors hover:text-[#6A9580]"
          >
            <ExternalLink className="h-3 w-3" />
            {s.title}
          </a>
        ))}
      </div>
    </div>
  );
}

function TerminalConfidenceBarV2({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const filled = Math.round(pct / 10);
  const empty = 10 - filled;
  const color = value > 0.7 ? "#4A9B7F" : value > 0.4 ? "#8B7A3A" : "#B85C38";

  return (
    <span className="font-mono text-sm" style={{ color }}>
      {"█".repeat(filled)}
      {"░".repeat(empty)} {pct}%
    </span>
  );
}
