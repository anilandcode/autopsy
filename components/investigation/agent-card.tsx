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
  CounterfactualAgentFinding,
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
  idle: { label: "Idle", bg: "rgba(42,42,42,1)", text: "#71706B" },
  researching: {
    label: "Researching",
    bg: "rgba(255,214,10,0.15)",
    text: "#FFD60A",
  },
  analyzing: {
    label: "Analyzing",
    bg: "rgba(255,214,10,0.15)",
    text: "#FFD60A",
  },
  done: { label: "Done", bg: "rgba(6,214,160,0.10)", text: "#06D6A0" },
  error: { label: "Error", bg: "rgba(214,40,40,0.15)", text: "#D62828" },
};

const riskLevelConfig: Record<RiskLevel, { label: string; color: string }> = {
  low: { label: "Low", color: "#06D6A0" },
  medium: { label: "Medium", color: "#FFD60A" },
  high: { label: "High", color: "#D62828" },
  critical: { label: "Critical", color: "#D62828" },
};

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    value > 0.7 ? "#06D6A0" : value > 0.4 ? "#FFD60A" : "#D62828";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-[#2A2A2A]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}

interface AgentCardProps {
  role: AgentRole;
  status: AgentStatus;
  finding: AgentFinding | null;
  premortemFinding: PremortemFinding | null;
  founderFinding: FounderFinding | null;
  counterfactualFinding: CounterfactualAgentFinding | null;
  index: number;
  mode: InvestigationMode;
}

export function AgentCard({
  role,
  status,
  finding,
  premortemFinding,
  founderFinding,
  counterfactualFinding,
  mode,
}: AgentCardProps) {
  const displayName = agentConfig[role];

  const isPremortem = mode === "premortem";
  const isFounder = mode === "founder";
  const isCF = mode === "counterfactual";
  const activeFinding = isCF
    ? counterfactualFinding
    : isFounder
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
      {/* Card body */}
      <div className="relative rounded-lg border border-[#3F3F3F] bg-[#161616] p-4">
        {/* Status or risk badge */}
        <div className="absolute right-3 top-3">
          {showRiskBadge ? (
            <span
              className="inline-block rounded-full px-2.5 py-1 text-[10px] font-medium"
              style={{
                backgroundColor: `${riskLevelConfig[activeRiskLevel!].color}15`,
                color: riskLevelConfig[activeRiskLevel!].color,
              }}
            >
              {riskLevelConfig[activeRiskLevel!].label}
            </span>
          ) : (
            <span
              className="inline-block rounded-full px-2.5 py-1 text-[10px] font-medium"
              style={{
                backgroundColor: statusConfig[status].bg,
                color: statusConfig[status].text,
              }}
            >
              {statusConfig[status].label}
            </span>
          )}
        </div>

        {/* Agent name */}
        <p className="pr-20 text-sm font-medium text-[#F4F1EA]">
          {displayName}
        </p>

        {/* Content by status and mode */}
        {(status === "researching" || status === "analyzing") &&
          !activeFinding && <SkeletonLines />}

        {status === "idle" && (
          <p className="mt-3 text-xs text-[#71706B]">Awaiting deployment</p>
        )}

        {status === "error" && !activeFinding && (
          <p className="mt-3 text-xs text-[#D62828]">Agent error</p>
        )}

        {(status === "done" || status === "error") &&
          activeFinding &&
          isFounder &&
          founderFinding && <FounderCardContent finding={founderFinding} />}

        {(status === "done" || status === "error") &&
          activeFinding &&
          isCF &&
          counterfactualFinding && <CounterfactualCardContent finding={counterfactualFinding} />}

        {(status === "done" || status === "error") &&
          activeFinding &&
          isPremortem && (
            <PremortemCardContent finding={activeFinding as PremortemFinding} />
          )}

        {(status === "done" || status === "error") &&
          activeFinding &&
          !isPremortem &&
          !isFounder &&
          !isCF && (
            <PostmortemCardContent finding={activeFinding as AgentFinding} />
          )}
      </div>
    </motion.div>
  );
}

function SkeletonLines() {
  return (
    <div className="mt-3 space-y-2">
      <div className="h-3 w-3/4 animate-pulse rounded bg-[#2A2A2A]" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-[#2A2A2A]" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-[#2A2A2A]" />
    </div>
  );
}

function PostmortemCardContent({ finding }: { finding: AgentFinding }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = finding.fullAnalysis && finding.fullAnalysis.length > 200;

  return (
    <div className="mt-3">
      {finding.primaryCause && (
        <p
          className="mb-2 text-base leading-7 text-[#F4F1EA]"
          style={{ fontFamily: '"Instrument Serif", serif' }}
        >
          {finding.primaryCause}
        </p>
      )}

      {typeof finding.confidence === "number" && finding.confidence > 0 && (
        <div className="mb-3">
          <span className="text-[10px] text-[#71706B]">Confidence</span>
          <ConfidenceBar value={finding.confidence} />
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
              className="mt-1.5 text-xs text-[#B8B5AE] transition-colors hover:text-[#F4F1EA]"
            >
              Read full analysis
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
    <div className="mt-3">
      {finding.topRisk && (
        <p
          className="mb-2 text-base leading-7 text-[#F4F1EA]"
          style={{ fontFamily: '"Instrument Serif", serif' }}
        >
          Top risk: {finding.topRisk}
        </p>
      )}

      {finding.evidence.length > 0 && (
        <div className="mb-3 space-y-1">
          {finding.evidence.map((ev, i) => (
            <p key={i} className="text-xs leading-5 text-[#B8B5AE]">
              {ev}
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
          <p className="mb-1.5 text-[10px] font-medium text-[#FFD60A]">
            Early warnings to watch
          </p>
          {finding.earlyWarnings.map((w, i) => (
            <p key={i} className="text-[11px] leading-5 text-[#B8B5AE]">
              {w}
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
    <div className="mt-3">
      {finding.topFailureMode && (
        <p
          className="mb-2 text-base leading-7 text-[#F4F1EA]"
          style={{ fontFamily: '"Instrument Serif", serif' }}
        >
          {finding.topFailureMode}
        </p>
      )}

      {finding.evidence.length > 0 && (
        <div className="mb-3 space-y-1">
          {finding.evidence.map((ev, i) => (
            <p key={i} className="text-xs leading-5 text-[#B8B5AE]">
              {ev}
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
          <p className="mb-1.5 text-[10px] font-medium text-[#06D6A0]">
            Mitigations
          </p>
          {finding.mitigations.map((m, i) => (
            <p key={i} className="text-[11px] leading-5 text-[#B8B5AE]">
              {m}
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

function CounterfactualCardContent({ finding }: { finding: CounterfactualAgentFinding }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = finding.reasoning && finding.reasoning.length > 200;
  const confidencePct = Math.round(finding.confidenceInAlterate);
  const barColor = confidencePct > 70 ? "#06D6A0" : confidencePct > 40 ? "#FFD60A" : "#D62828";

  return (
    <div className="mt-3">
      {/* Two-column: actual vs alternate */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-medium text-[#5C5852]">Actual timeline</p>
          <p className="mt-1 line-clamp-4 text-xs leading-5 text-[#B8B5AE]">
            {finding.actualOutcome}
          </p>
        </div>
        <div className="border-l border-[#2A2A2A] pl-3">
          <p className="text-[10px] font-medium text-[#FACC15]">Alternate timeline</p>
          <p className="mt-1 line-clamp-4 text-xs leading-5 text-[#B8B5AE]">
            {finding.alternateOutcome}
          </p>
        </div>
      </div>

      {/* Verdict */}
      <div className="mt-3 border-t border-[#2A2A2A] pt-3">
        <p className={`text-xs font-medium ${finding.wouldItHaveHelped ? "text-[#06D6A0]" : "text-[#D62828]"}`}>
          Verdict: {finding.wouldItHaveHelped ? "Would have helped" : "Wouldn't have mattered"}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[10px] text-[#71706B]">Confidence</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-[#2A2A2A]">
              <div className="h-full rounded-full transition-all" style={{ width: `${confidencePct}%`, backgroundColor: barColor }} />
            </div>
            <span className="text-xs font-medium" style={{ color: barColor }}>{confidencePct}%</span>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      {finding.reasoning && (
        <>
          <p className={`mt-2 text-sm leading-5 text-[#B8B5AE] ${!expanded ? "line-clamp-3" : ""}`}>
            {finding.reasoning}
          </p>
          {isLong && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-1 text-xs text-[#B8B5AE] transition-colors hover:text-[#F4F1EA]"
            >
              Read full analysis
            </button>
          )}
        </>
      )}

      {/* Historical precedents */}
      {finding.historicalPrecedents.length > 0 && (
        <div className="mt-3 border-t border-[#2A2A2A] pt-3">
          {finding.historicalPrecedents.map((p, i) => (
            <p key={i} className="text-[11px] leading-5 text-[#B8B5AE]">
              <span className="text-[10px] text-[#FACC15]">Precedent: </span>
              {p}
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
      <p className="mb-1.5 text-[10px] font-medium text-[#5C5852]">Sources</p>
      {sources.slice(0, 3).map((src, i) => (
        <a
          key={i}
          href={src.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-[#B8B5AE] no-underline transition-colors hover:text-[#F4F1EA] hover:underline"
        >
          <ExternalLink className="h-2.5 w-2.5 shrink-0" />
          {src.title}
        </a>
      ))}
    </div>
  );
}
