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

const agentConfig: Record<AgentRole, string> = {
  "market-analyst": "Market Analyst",
  operator: "The Operator",
  "money-trail": "Money Trail",
  "customer-voice": "Customer Voice",
  engineer: "The Engineer",
  historian: "The Historian",
  synthesizer: "The Synthesizer",
};

const statusConfig: Record<
  AgentStatus,
  { label: string; bg: string; text: string }
> = {
  idle: { label: "IDLE", bg: "rgba(42,42,42,1)", text: "#71706B" },
  researching: {
    label: "RESEARCHING",
    bg: "rgba(255,214,10,0.15)",
    text: "#FFD60A",
  },
  analyzing: {
    label: "ANALYZING",
    bg: "rgba(255,214,10,0.15)",
    text: "#FFD60A",
  },
  done: { label: "VERIFIED", bg: "rgba(6,214,160,0.10)", text: "#06D6A0" },
  error: { label: "ERROR", bg: "rgba(214,40,40,0.15)", text: "#D62828" },
};

const riskLevelConfig: Record<RiskLevel, { label: string; color: string }> = {
  low: { label: "LOW", color: "#06D6A0" },
  medium: { label: "MEDIUM", color: "#FFD60A" },
  high: { label: "HIGH", color: "#D62828" },
  critical: { label: "CRITICAL", color: "#D62828" },
};

function TerminalConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const filled = Math.round(pct / 10);
  const empty = 10 - filled;
  const color =
    value > 0.7 ? "#06D6A0" : value > 0.4 ? "#FFD60A" : "#D62828";

  return (
    <span className="font-mono text-xs tracking-wider" style={{ color }}>
      {"█".repeat(filled)}
      {"░".repeat(empty)} {pct}%
    </span>
  );
}

interface AgentCardProps {
  role: AgentRole;
  status: AgentStatus;
  finding: AgentFinding | null;
  premortemFinding: PremortemFinding | null;
  founderFinding: FounderFinding | null;
  index: number;
  mode: InvestigationMode;
}

export function AgentCard({
  role,
  status,
  finding,
  premortemFinding,
  founderFinding,
  index,
  mode,
}: AgentCardProps) {
  const displayName = agentConfig[role];
  const fileNumber = String(index + 1).padStart(2, "0");

  const isPremortem = mode === "premortem";
  const isFounder = mode === "founder";
  const activeFinding = isFounder
    ? founderFinding
    : isPremortem
      ? premortemFinding
      : finding;
  const activeRiskLevel =
    isFounder && founderFinding
      ? founderFinding.severity
      : isPremortem && premortemFinding
        ? premortemFinding.riskLevel
        : null;

  const showRiskBadge = (isPremortem || isFounder) && activeRiskLevel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "linear" }}
      className="flex flex-col"
    >
      {/* Yellow file folder stripe */}
      <div
        className="flex h-2 items-center bg-[#FFD60A] px-3"
        style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
      >
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-black">
          FILE #{fileNumber} — {displayName}
        </span>
      </div>

      {/* Card body */}
      <div className="relative border-2 border-[#3F3F3F] bg-[#161616] p-4">
        {/* Status or risk badge */}
        <div className="absolute right-3 top-3">
          {showRiskBadge ? (
            <span
              className="inline-block rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em]"
              style={{
                backgroundColor: `${riskLevelConfig[activeRiskLevel!].color}15`,
                color: riskLevelConfig[activeRiskLevel!].color,
              }}
            >
              [{riskLevelConfig[activeRiskLevel!].label}]
            </span>
          ) : (
            <span
              className="inline-block rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em]"
              style={{
                backgroundColor: statusConfig[status].bg,
                color: statusConfig[status].text,
              }}
            >
              [{statusConfig[status].label}]
            </span>
          )}
        </div>

        {/* Content by status and mode */}
        {(status === "researching" || status === "analyzing") &&
          !activeFinding && <SkeletonLines />}

        {status === "idle" && (
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#71706B]">
            AWAITING DEPLOYMENT
          </p>
        )}

        {status === "error" && !activeFinding && (
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#D62828]">
            AGENT ERROR
          </p>
        )}

        {(status === "done" || status === "error") &&
          activeFinding &&
          isFounder &&
          founderFinding && <FounderCardContent finding={founderFinding} />}

        {(status === "done" || status === "error") &&
          activeFinding &&
          isPremortem && (
            <PremortemCardContent finding={activeFinding as PremortemFinding} />
          )}

        {(status === "done" || status === "error") &&
          activeFinding &&
          !isPremortem &&
          !isFounder && (
            <PostmortemCardContent finding={activeFinding as AgentFinding} />
          )}
      </div>
    </motion.div>
  );
}

function SkeletonLines() {
  return (
    <div className="space-y-2 pt-1">
      <div className="h-3 w-3/4 animate-pulse bg-[#2A2A2A]" />
      <div className="h-3 w-1/2 animate-pulse bg-[#2A2A2A]" />
      <div className="h-3 w-2/3 animate-pulse bg-[#2A2A2A]" />
    </div>
  );
}

function PostmortemCardContent({ finding }: { finding: AgentFinding }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = finding.fullAnalysis && finding.fullAnalysis.length > 200;

  return (
    <div className="pt-1">
      {finding.primaryCause && (
        <p
          className="mb-2 font-serif text-lg leading-7 text-[#F4F1EA]"
          style={{ fontFamily: '"Instrument Serif", serif' }}
        >
          {finding.primaryCause}
        </p>
      )}

      {typeof finding.confidence === "number" && finding.confidence > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#71706B]">
            Confidence
          </span>
          <TerminalConfidenceBar value={finding.confidence} />
        </div>
      )}

      {finding.fullAnalysis && (
        <>
          <p
            className={`text-sm leading-5 text-[#B8B5AE] ${!expanded ? "line-clamp-4" : ""}`}
          >
            {finding.fullAnalysis}
          </p>
          {isLong && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#B8B5AE] transition-colors hover:text-[#F4F1EA]"
            >
              ▸ READ FULL ANALYSIS
            </button>
          )}
        </>
      )}

      {finding.sources && finding.sources.length > 0 && (
        <SourcesSection sources={finding.sources} />
      )}
    </div>
  );
}

function PremortemCardContent({ finding }: { finding: PremortemFinding }) {
  return (
    <div className="pt-1">
      {finding.topRisk && (
        <p
          className="mb-2 font-serif text-lg leading-7 text-[#F4F1EA]"
          style={{ fontFamily: '"Instrument Serif", serif' }}
        >
          Top Risk: {finding.topRisk}
        </p>
      )}

      {finding.evidence.length > 0 && (
        <div className="mb-3 space-y-1">
          {finding.evidence.map((ev, i) => (
            <p key={i} className="text-xs leading-5 text-[#B8B5AE]">
              • {ev}
            </p>
          ))}
        </div>
      )}

      {finding.fullAnalysis && (
        <p className="mb-3 line-clamp-4 text-sm leading-5 text-[#B8B5AE]">
          {finding.fullAnalysis}
        </p>
      )}

      {finding.earlyWarnings.length > 0 && (
        <div className="border-t border-[#2A2A2A] pt-3">
          <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#FFD60A]">
            EARLY WARNINGS TO WATCH
          </p>
          {finding.earlyWarnings.map((w, i) => (
            <p key={i} className="text-[11px] leading-5 text-[#B8B5AE]">
              ▸ {w}
            </p>
          ))}
        </div>
      )}

      {finding.sources && finding.sources.length > 0 && (
        <SourcesSection sources={finding.sources} />
      )}
    </div>
  );
}

function FounderCardContent({ finding }: { finding: FounderFinding }) {
  return (
    <div className="pt-1">
      {finding.topFailureMode && (
        <p
          className="mb-2 font-serif text-lg leading-7 text-[#F4F1EA]"
          style={{ fontFamily: '"Instrument Serif", serif' }}
        >
          {finding.topFailureMode}
        </p>
      )}

      {finding.evidence.length > 0 && (
        <div className="mb-3 space-y-1">
          {finding.evidence.map((ev, i) => (
            <p key={i} className="text-xs leading-5 text-[#B8B5AE]">
              • {ev}
            </p>
          ))}
        </div>
      )}

      {finding.fullAnalysis && (
        <p className="mb-3 line-clamp-4 text-sm leading-5 text-[#B8B5AE]">
          {finding.fullAnalysis}
        </p>
      )}

      {finding.mitigations && finding.mitigations.length > 0 && (
        <div className="border-t border-[#2A2A2A] pt-3">
          <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#06D6A0]">
            MITIGATIONS
          </p>
          {finding.mitigations.map((m, i) => (
            <p key={i} className="text-[11px] leading-5 text-[#B8B5AE]">
              ▸ {m}
            </p>
          ))}
        </div>
      )}

      {finding.sources && finding.sources.length > 0 && (
        <SourcesSection sources={finding.sources} />
      )}
    </div>
  );
}

function SourcesSection({
  sources,
}: {
  sources: { title: string; url: string }[];
}) {
  return (
    <div className="mt-3 border-t border-[#2A2A2A] pt-3">
      <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#5C5852]">
        SOURCES
      </p>
      {sources.slice(0, 3).map((src, i) => (
        <a
          key={i}
          href={src.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-[11px] text-[#B8B5AE] no-underline transition-colors hover:text-[#F4F1EA] hover:underline"
        >
          <ExternalLink className="h-2.5 w-2.5 shrink-0" />
          → {src.title}
        </a>
      ))}
    </div>
  );
}
