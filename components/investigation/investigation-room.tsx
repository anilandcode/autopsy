"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Corkboard } from "./corkboard";
import { FinalVerdict } from "./final-verdict";
import type { AgentFinding, AgentRole, AgentStatus, PostmortemReport } from "@/types/investigation";

const AGENT_ROLES: AgentRole[] = [
  "market-analyst",
  "operator",
  "money-trail",
  "customer-voice",
  "engineer",
  "historian",
];

const examples = [
  "Quibi", "Theranos", "Google+", "MoviePass",
  "Juicero", "WeWork", "Vine", "Clubhouse",
];

function normalizeConfidence(val: number): number {
  if (val > 1) return val / 100;
  return val;
}

export function InvestigationRoom() {
  const searchParams = useSearchParams();
  const [subject, setSubject] = useState("");
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [agentFindings, setAgentFindings] = useState<Record<AgentRole, AgentFinding | null>>(
    () => Object.fromEntries(AGENT_ROLES.map((r) => [r, null])) as Record<AgentRole, AgentFinding | null>
  );
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentRole, AgentStatus>>(
    () => Object.fromEntries(AGENT_ROLES.map((r) => [r, "idle"])) as Record<AgentRole, AgentStatus>
  );
  const [report, setReport] = useState<PostmortemReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasAutoTriggered = useRef(false);

  // Pre-fill from URL param
  useEffect(() => {
    const s = searchParams.get("subject");
    if (s) setSubject(s);
  }, [searchParams]);

  // Auto-trigger investigation from URL param
  useEffect(() => {
    const s = searchParams.get("subject");
    if (s && !hasAutoTriggered.current) {
      hasAutoTriggered.current = true;
      const timer = setTimeout(() => {
        startInvestigation(s);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const startInvestigation = useCallback(async (subj: string) => {
    if (!subj.trim()) return;

    setIsInvestigating(true);
    setError(null);
    setReport(null);

    // Set all agents to researching
    const researchingStatuses = Object.fromEntries(
      AGENT_ROLES.map((r) => [r, "researching"])
    ) as Record<AgentRole, AgentStatus>;
    setAgentStatuses(researchingStatuses);
    setAgentFindings(
      Object.fromEntries(AGENT_ROLES.map((r) => [r, null])) as Record<AgentRole, AgentFinding | null>
    );

    try {
      const response = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subj }),
      });

      if (!response.ok) {
        setError(`Server error: ${response.status}`);
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const { type, data } = JSON.parse(line.slice(6));

              if (type === "agent_update" && data?.role) {
                const finding: AgentFinding = {
                  ...data,
                  confidence: normalizeConfidence(data.confidence),
                };
                setAgentFindings((prev) => ({
                  ...prev,
                  [data.role as AgentRole]: finding,
                }));
                setAgentStatuses((prev) => ({
                  ...prev,
                  [data.role as AgentRole]: data.status || "done",
                }));
              }

              if (type === "complete") {
                const rpt = data as PostmortemReport;
                setReport({
                  ...rpt,
                  confidenceScore: normalizeConfidence(rpt.confidenceScore),
                });
              }

              if (type === "error") {
                setError(data.message || "Unknown error");
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    }
  }, []);

  const handleStart = useCallback(() => {
    startInvestigation(subject);
  }, [subject, startInvestigation]);

  return (
    <main className="min-h-dvh bg-[#0A0A0A] text-[#FAFAFA]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 sm:px-12">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[#71717A] transition-colors hover:text-[#FAFAFA]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>
        <span className="font-mono text-lg font-bold tracking-wider text-[#EF4444]">
          AUTOPSY
        </span>
        <div className="w-20" />
      </nav>

      <AnimatePresence mode="wait">
        {!isInvestigating ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-20 pb-20 sm:px-12 sm:pt-28"
          >
            <h1 className="mb-3 text-center text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-5xl">
              What failed?
            </h1>
            <p className="mb-10 text-center text-[#71717A]">
              6 agents will research and debate in parallel
            </p>

            <div className="w-full">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#52525B]" />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  placeholder="e.g. Quibi, Theranos, Google Glass, your startup..."
                  className="h-14 w-full rounded-xl border border-[#222222] bg-[#111111] pl-12 pr-5 text-[#FAFAFA] placeholder-[#52525B] outline-none transition-colors focus:border-[#EF4444]/50"
                />
              </div>

              <button
                onClick={handleStart}
                disabled={!subject.trim()}
                className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#EF4444] px-8 text-base font-semibold text-white shadow-lg shadow-[#EF4444]/20 transition-all hover:bg-[#DC2626] hover:shadow-[#EF4444]/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Begin Investigation
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Example chips */}
            <div className="mt-10 w-full">
              <p className="mb-3 text-sm text-[#71717A]">
                or choose a famous failure:
              </p>
              <div className="flex flex-wrap gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setSubject(ex)}
                    className="rounded-full border border-[#222222] bg-[#111111] px-4 py-2 text-sm text-[#A1A1AA] transition-all hover:border-[#EF4444]/30 hover:text-[#FAFAFA]"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="investigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-10 sm:px-12"
          >
            {/* Error banner */}
            {error && (
              <div className="mx-auto mb-6 max-w-5xl rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/5 px-5 py-4 text-sm text-[#EF4444]">
                Error: {error}
              </div>
            )}

            <Corkboard
              subject={subject}
              agentRoles={AGENT_ROLES}
              agentFindings={agentFindings}
              agentStatuses={agentStatuses}
            />

            {report && <FinalVerdict report={report} />}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
