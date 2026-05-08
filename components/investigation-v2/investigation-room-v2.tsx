"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { CorkboardV2 } from "./corkboard-v2";
import { FinalVerdictV2 } from "./final-verdict-v2";
import { PremortemVerdictV2 } from "./premortem-verdict-v2";
import { FounderVerdictV2 } from "./founder-verdict-v2";
import { DebateRoomV2 } from "./debate-room-v2";
import type { AgentFinding, AgentRole, AgentStatus, PostmortemReport, PremortemFinding, PremortemReport, FounderFinding, FounderReport, InvestigationMode, AgentDebateOutput } from "@/types/investigation";

const AGENT_ROLES: AgentRole[] = [
  "market-analyst",
  "operator",
  "money-trail",
  "customer-voice",
  "engineer",
  "historian",
];

const postmortemExamples = [
  "Quibi", "Theranos", "Google+", "MoviePass",
  "Juicero", "WeWork", "Vine", "Clubhouse",
];

const premortemExamples = [
  "Cursor", "Anthropic", "Perplexity", "Vercel",
  "Linear", "Notion", "Stripe", "Figma",
  "Replit", "Cohere", "Character.AI", "Hugging Face",
];

const STAGES = ["Pre-launch", "MVP", "Product-Market Fit", "Scaling", "Growth"];

function generateCaseNumber() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `2026-${num}`;
}

function normalizeConfidence(val: number): number {
  if (val > 1) return val / 100;
  return val;
}

function makeEmptyFindings(): Record<AgentRole, AgentFinding | null> {
  return Object.fromEntries(AGENT_ROLES.map((r) => [r, null])) as Record<AgentRole, AgentFinding | null>;
}

function makeEmptyPremortemFindings(): Record<AgentRole, PremortemFinding | null> {
  return Object.fromEntries(AGENT_ROLES.map((r) => [r, null])) as Record<AgentRole, PremortemFinding | null>;
}

function makeEmptyFounderFindings(): Record<AgentRole, FounderFinding | null> {
  return Object.fromEntries(AGENT_ROLES.map((r) => [r, null])) as Record<AgentRole, FounderFinding | null>;
}

function makeEmptyStatuses(): Record<AgentRole, AgentStatus> {
  return Object.fromEntries(AGENT_ROLES.map((r) => [r, "idle"])) as Record<AgentRole, AgentStatus>;
}

export function InvestigationRoomV2() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<InvestigationMode>("postmortem");
  const [subject, setSubject] = useState("");
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [agentFindings, setAgentFindings] = useState<Record<AgentRole, AgentFinding | null>>(makeEmptyFindings);
  const [premortemFindings, setPremortemFindings] = useState<Record<AgentRole, PremortemFinding | null>>(makeEmptyPremortemFindings);
  const [founderFindings, setFounderFindings] = useState<Record<AgentRole, FounderFinding | null>>(makeEmptyFounderFindings);
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentRole, AgentStatus>>(makeEmptyStatuses);
  const [report, setReport] = useState<PostmortemReport | null>(null);
  const [premortemReport, setPremortemReport] = useState<PremortemReport | null>(null);
  const [founderReport, setFounderReport] = useState<FounderReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [debateOutputs, setDebateOutputs] = useState<AgentDebateOutput[]>([]);
  const [debateStarted, setDebateStarted] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [caseNumber] = useState(generateCaseNumber);

  // Founder form fields
  const [founderName, setFounderName] = useState("");
  const [founderDescription, setFounderDescription] = useState("");
  const [founderStage, setFounderStage] = useState("MVP");
  const [founderTargetCustomer, setFounderTargetCustomer] = useState("");

  const hasAutoTriggered = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);
  const verdictRef = useRef<HTMLDivElement | null>(null);

  function addLog(msg: string) {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`]);
  }

  useEffect(() => {
    if (logOpen) logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, logOpen]);

  useEffect(() => {
    if (report || premortemReport || founderReport) {
      setTimeout(() => verdictRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [report, premortemReport, founderReport]);

  useEffect(() => {
    const s = searchParams.get("subject");
    if (s) setSubject(s);
  }, [searchParams]);

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

    const currentMode = mode;
    setIsInvestigating(true);
    setError(null);
    setReport(null);
    setPremortemReport(null);
    setFounderReport(null);
    setLogs([]);
    setDebateOutputs([]);
    setDebateStarted(false);

    setAgentStatuses(
      Object.fromEntries(AGENT_ROLES.map((r) => [r, "researching"])) as Record<AgentRole, AgentStatus>
    );
    setAgentFindings(makeEmptyFindings());
    setPremortemFindings(makeEmptyPremortemFindings());
    setFounderFindings(makeEmptyFounderFindings());

    addLog("Checking API connection...");
    try {
      const healthRes = await fetch("/api/test");
      const healthData = await healthRes.json();
      if (healthData.error) {
        addLog("API ERROR: " + healthData.error);
        setError("API connection failed: " + healthData.error);
        setIsInvestigating(false);
        return;
      }
      addLog("API OK — model: " + healthData.env?.model);
      addLog("Tavily OK — " + healthData.searchResultsCount + " results");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown";
      addLog("Health check failed: " + msg);
      setError("Health check failed: " + msg);
      setIsInvestigating(false);
      return;
    }

    let apiEndpoint: string;
    let requestBody: Record<string, unknown>;

    if (currentMode === "founder") {
      apiEndpoint = "/api/founder-mode";
      requestBody = {
        name: founderName.trim(),
        description: founderDescription.trim(),
        stage: founderStage,
        targetCustomer: founderTargetCustomer.trim() || undefined,
      };
    } else {
      apiEndpoint = currentMode === "premortem" ? "/api/premortem" : "/api/investigate";
      requestBody = { subject: subj };
    }

    addLog(`Starting ${currentMode} for: ${subj}`);
    abortRef.current = new AbortController();

    let streamClosedWithoutReport = false;

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        addLog("Server error: " + response.status);
        setError(`Server error: ${response.status}`);
        return;
      }

      addLog("SSE connection opened");

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          addLog("Stream closed");
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const { type, data } = JSON.parse(line.slice(6));
              addLog("Received event: " + type);

              if (type === "agent_started" && data?.role) {
                addLog("Agent started: " + data.role);
                setAgentStatuses((prev) => ({
                  ...prev,
                  [data.role as AgentRole]: "analyzing",
                }));
              }

              if (type === "agent_update" && data?.role) {
                if (currentMode === "founder") {
                  const fFinding = {
                    role: data.role,
                    displayName: data.displayName,
                    status: data.status || "done",
                    topFailureMode: data.topFailureMode || "Risk identified",
                    severity: data.severity || "medium",
                    evidence: data.evidence || [],
                    fullAnalysis: data.fullAnalysis || "",
                    mitigations: data.mitigations || [],
                    sources: data.sources || [],
                  };
                  addLog("Agent done: " + fFinding.displayName + " | Severity: " + fFinding.severity.toUpperCase());
                  setFounderFindings((prev) => ({ ...prev, [data.role as AgentRole]: fFinding }));
                  setAgentFindings((prev) => ({
                    ...prev,
                    [data.role as AgentRole]: {
                      role: data.role, displayName: data.displayName, status: data.status || "done",
                      primaryCause: fFinding.topFailureMode, evidence: fFinding.evidence,
                      confidence: 0.5, fullAnalysis: fFinding.fullAnalysis, sources: fFinding.sources,
                    },
                  }));
                } else if (currentMode === "premortem") {
                  const pmFinding = {
                    ...data,
                    riskLevel: data.riskLevel || "medium",
                    topRisk: data.topRisk || data.primaryCause || "Risk identified",
                    earlyWarnings: data.earlyWarnings || [],
                  };
                  addLog("Agent done: " + data.displayName + " | Risk: " + pmFinding.riskLevel.toUpperCase());
                  setPremortemFindings((prev) => ({ ...prev, [data.role as AgentRole]: pmFinding }));
                  setAgentFindings((prev) => ({
                    ...prev,
                    [data.role as AgentRole]: {
                      role: data.role, displayName: data.displayName, status: data.status || "done",
                      primaryCause: pmFinding.topRisk, evidence: pmFinding.evidence || [],
                      confidence: 0.5, fullAnalysis: pmFinding.fullAnalysis || "", sources: pmFinding.sources || [],
                    },
                  }));
                } else {
                  const finding = { ...data, confidence: normalizeConfidence(data.confidence) };
                  addLog("Agent done: " + data.displayName + " | Confidence: " + Math.round(finding.confidence * 100) + "%");
                  setAgentFindings((prev) => ({ ...prev, [data.role as AgentRole]: finding }));
                }
                setAgentStatuses((prev) => ({ ...prev, [data.role as AgentRole]: data.status || "done" }));
              }

              if (type === "debate_started") {
                addLog("Debate round started — agents challenge each other");
                setDebateStarted(true);
              }

              if (type === "debate_complete" && Array.isArray(data)) {
                const debate = data as AgentDebateOutput[];
                addLog("Debate round complete — " + debate.length + " rebuttals");
                setDebateOutputs(debate);
              }

              if (type === "complete") {
                if (currentMode === "founder") {
                  const fRpt = data as FounderReport;
                  setFounderReport(fRpt);
                  if (fRpt.agentFindings) {
                    const fMap = {} as Record<AgentRole, FounderFinding | null>;
                    for (const af of fRpt.agentFindings) fMap[af.role as AgentRole] = af;
                    setFounderFindings((prev) => ({ ...prev, ...fMap }));
                  }
                } else if (currentMode === "premortem") {
                  const pmRpt = data as PremortemReport;
                  setPremortemReport(pmRpt);
                  if (pmRpt.agentFindings) {
                    const pmMap = {} as Record<AgentRole, PremortemFinding | null>;
                    for (const af of pmRpt.agentFindings) pmMap[af.role as AgentRole] = af;
                    setPremortemFindings((prev) => ({ ...prev, ...pmMap }));
                  }
                } else {
                  const rpt = data as PostmortemReport;
                  setReport({ ...rpt, confidenceScore: normalizeConfidence(rpt.confidenceScore) });
                }
                addLog("Synthesis complete — report ready");
              }

              if (type === "error") {
                addLog("ERROR: " + (data.message || "Unknown error"));
                setError(data.message || "Unknown error");
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      }

      streamClosedWithoutReport = true;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        addLog("Investigation cancelled by user");
        streamClosedWithoutReport = false;
      } else {
        const msg = err instanceof Error ? err.message : "Network error";
        addLog("CAUGHT ERROR: " + msg);
        setError(msg);
      }
    }

    // Fallback synthesis for postmortem
    if (streamClosedWithoutReport && currentMode === "postmortem") {
      setAgentFindings((currentFindings) => {
        const doneAgents = Object.values(currentFindings).filter(
          (f): f is AgentFinding => f !== null && f.status === "done"
        );
        if (doneAgents.length >= 5 && !report) {
          addLog("Stream closed without synthesis — requesting fallback...");
          fetch("/api/synthesize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: subj, findings: doneAgents }),
          })
            .then((r) => r.json())
            .then((fallbackReport: PostmortemReport) => {
              setReport({ ...fallbackReport, confidenceScore: normalizeConfidence(fallbackReport.confidenceScore) });
              addLog("Fallback synthesis complete");
            })
            .catch((e: Error) => {
              addLog("Fallback synthesis failed: " + e.message);
              setError("Synthesis failed");
            });
        }
        return currentFindings;
      });
    }
  }, [mode, founderName, founderDescription, founderStage, founderTargetCustomer]);

  const handleStart = useCallback(() => {
    startInvestigation(subject);
  }, [subject, startInvestigation]);

  const handleFounderStart = useCallback(() => {
    if (!founderName.trim() || !founderDescription.trim()) return;
    setSubject(founderName);
    startInvestigation(founderName);
  }, [founderName, founderDescription, startInvestigation]);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    setIsInvestigating(false);
    addLog("Investigation cancelled by user");
  }, []);

  const handleNewInvestigation = useCallback(() => {
    setReport(null);
    setPremortemReport(null);
    setFounderReport(null);
    setError(null);
    setIsInvestigating(false);
    setLogs([]);
    setDebateOutputs([]);
    setDebateStarted(false);
    setAgentFindings(makeEmptyFindings());
    setPremortemFindings(makeEmptyPremortemFindings());
    setFounderFindings(makeEmptyFounderFindings());
    setAgentStatuses(makeEmptyStatuses());
  }, []);

  const activeExamples = mode === "founder" ? [] : mode === "premortem" ? premortemExamples : postmortemExamples;
  const placeholder = mode === "founder"
    ? ""
    : mode === "premortem"
      ? "Cursor, Notion, Linear, Anthropic, your startup..."
      : "e.g. Quibi, Theranos, Google Glass, your startup...";
  const logLabel = mode === "founder"
    ? "FOUNDER MODE LOG"
    : mode === "premortem"
      ? "PRE-MORTEM LOG"
      : "INVESTIGATION LOG";

  const founderFormValid = founderName.trim() && founderDescription.trim();

  return (
    <main className="min-h-dvh bg-[#FEFCF5] text-[#3C3A39]">
      {/* Green case header stripe */}
      {isInvestigating && (
        <div className="bg-[#81B09A] px-6 py-2 sm:px-12">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-white">
            CASE FILE / INVESTIGATION IN PROGRESS
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex items-center justify-between border-b border-[#E5E2DD] px-6 py-4 sm:px-12">
        <Link
          href="/v2"
          className="text-sm font-medium text-[#6B6A69] transition-colors hover:text-[#3C3A39]"
        >
          ← Back
        </Link>
        <span className="text-lg font-bold tracking-tight text-[#3C3A39]">
          AUTOPSY
        </span>
        <Link
          href="/v2/investigate"
          className="rounded-[20px] bg-[#81B09A] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#6A9580]"
        >
          Launch
        </Link>
      </nav>

      {/* Case metadata strip (when investigating) */}
      {isInvestigating && (
        <div className="border-b border-[#E5E2DD] bg-white px-6 py-3 sm:px-12">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-1 font-mono text-[11px] uppercase tracking-wider">
            <span className="text-[#A0A09E]">CASE #: <span className="text-[#3C3A39]">{caseNumber}</span></span>
            <span className="text-[#A0A09E]">SUBJECT: <span className="text-[#81B09A]">{subject}</span></span>
            <span className="text-[#A0A09E]">INVESTIGATORS: <span className="text-[#3C3A39]">6 / DEPLOYED</span></span>
            <span className="text-[#A0A09E]">OPENED: <span className="text-[#3C3A39]">{new Date().toLocaleTimeString()}</span></span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isInvestigating ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-16 pb-20 sm:px-12 sm:pt-24"
          >
            {/* Mode toggle — pill style */}
            <div className="mb-10 flex w-full max-w-lg overflow-hidden rounded-[20px] border border-[#E5E2DD] bg-white p-1">
              {(["postmortem", "premortem", "founder"] as InvestigationMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-[16px] py-2.5 text-center font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${
                    mode === m
                      ? m === "postmortem"
                        ? "bg-[#81B09A] text-white"
                        : m === "premortem"
                          ? "bg-[#EDE6DB] text-[#3C3A39]"
                          : "bg-[#C6DACC] text-[#3C3A39]"
                      : "text-[#A0A09E] hover:text-[#6B6A69]"
                  }`}
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {m === "postmortem" ? "Postmortem" : m === "premortem" ? "Pre-Mortem" : "Founder Mode"}
                </button>
              ))}
            </div>

            <h1 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#3C3A39] sm:text-5xl">
              {mode === "founder" ? "Will your idea survive?" : mode === "premortem" ? "What could kill it?" : "What failed?"}
            </h1>
            <p className="mb-12 text-center text-[#6B6A69]">
              {mode === "founder"
                ? "6 agents stress-test your startup idea before you quit your day job"
                : mode === "premortem"
                  ? "6 agents assess risks and predict what could go wrong"
                  : "6 agents will research and debate in parallel"}
            </p>

            {mode === "founder" ? (
              /* Founder Mode — structured form */
              <div className="w-full space-y-5">
                {[
                  { label: "IDEA NAME", value: founderName, set: setFounderName, placeholder: "e.g. 'AI Pet Therapist'", type: "input" },
                  { label: "WHAT DOES IT DO?", value: founderDescription, set: setFounderDescription, placeholder: "Describe your idea in 2-3 sentences. What problem does it solve? How?", type: "textarea" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#A0A09E]">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full rounded-[12px] border border-[#E5E2DD] bg-white px-4 py-3 text-sm text-[#3C3A39] placeholder-[#A0A09E] outline-none transition-colors focus:border-[#81B09A] focus:ring-1 focus:ring-[#81B09A]"
                      />
                    ) : (
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        placeholder={field.placeholder}
                        className="h-12 w-full rounded-[12px] border border-[#E5E2DD] bg-white px-4 text-sm text-[#3C3A39] placeholder-[#A0A09E] outline-none transition-colors focus:border-[#81B09A] focus:ring-1 focus:ring-[#81B09A]"
                      />
                    )}
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#A0A09E]">
                      STAGE
                    </label>
                    <select
                      value={founderStage}
                      onChange={(e) => setFounderStage(e.target.value)}
                      className="h-12 w-full rounded-[12px] border border-[#E5E2DD] bg-white px-4 text-sm text-[#3C3A39] outline-none transition-colors focus:border-[#81B09A] focus:ring-1 focus:ring-[#81B09A]"
                    >
                      {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#A0A09E]">
                      TARGET CUSTOMER (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={founderTargetCustomer}
                      onChange={(e) => setFounderTargetCustomer(e.target.value)}
                      placeholder="e.g. 'SMB owners'"
                      className="h-12 w-full rounded-[12px] border border-[#E5E2DD] bg-white px-4 text-sm text-[#3C3A39] placeholder-[#A0A09E] outline-none transition-colors focus:border-[#81B09A] focus:ring-1 focus:ring-[#81B09A]"
                    />
                  </div>
                </div>
                <button
                  onClick={handleFounderStart}
                  disabled={!founderFormValid}
                  className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-[#81B09A] px-8 font-mono text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#6A9580] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  RUN FOUNDER MODE ▸
                </button>
              </div>
            ) : (
              /* Postmortem / Premortem — clean input */
              <div className="w-full">
                <div className="overflow-hidden rounded-[20px] border border-[#E5E2DD] bg-white shadow-sm">
                  <div className="flex items-center px-4">
                    <span className="px-2 font-mono text-sm text-[#81B09A]">▸</span>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleStart()}
                      placeholder={placeholder}
                      className="h-14 flex-1 bg-transparent text-sm text-[#3C3A39] placeholder-[#A0A09E] outline-none"
                    />
                  </div>
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#A0A09E]">
                  Press Enter to begin
                </p>

                {/* Example cases */}
                <div className="mt-10">
                  <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#A0A09E]">
                    EXAMPLE CASES:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeExamples.map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setSubject(ex)}
                        className="rounded-[12px] border border-[#E5E2DD] bg-white px-3 py-1.5 font-mono text-xs text-[#6B6A69] transition-colors hover:border-[#81B09A] hover:text-[#3C3A39]"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="investigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-10 sm:px-12"
          >
            {error && (
              <div className="mx-auto mb-6 max-w-5xl rounded-[12px] border border-[#B85C38]/30 bg-[#B85C38]/5 px-5 py-4 font-mono text-sm text-[#B85C38]">
                ERROR: {error}
              </div>
            )}

            <CorkboardV2
              subject={subject}
              agentRoles={AGENT_ROLES}
              agentFindings={agentFindings}
              premortemFindings={premortemFindings}
              founderFindings={founderFindings}
              agentStatuses={agentStatuses}
              mode={mode}
              onCancel={!report && !premortemReport && !founderReport ? handleCancel : undefined}
            />

            {/* Debate Room */}
            {mode === "postmortem" && (debateOutputs.length > 0 || debateStarted) && !report && (
              <DebateRoomV2 debate={debateOutputs} />
            )}

            {report && mode === "postmortem" && (
              <div ref={verdictRef}>
                <FinalVerdictV2 report={report} />
                <div className="mx-auto mt-8 flex max-w-5xl justify-center">
                  <button
                    onClick={handleNewInvestigation}
                    className="inline-flex h-12 items-center gap-2 rounded-[20px] bg-[#81B09A] px-8 font-mono text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#6A9580]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    NEW INVESTIGATION
                  </button>
                </div>
              </div>
            )}

            {premortemReport && mode === "premortem" && (
              <div ref={verdictRef}>
                <PremortemVerdictV2 report={premortemReport} />
                <div className="mx-auto mt-8 flex max-w-5xl justify-center">
                  <button
                    onClick={handleNewInvestigation}
                    className="inline-flex h-12 items-center gap-2 rounded-[20px] bg-[#8B7A3A] px-8 font-mono text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#7A6A30]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    NEW PRE-MORTEM
                  </button>
                </div>
              </div>
            )}

            {founderReport && mode === "founder" && (
              <div ref={verdictRef}>
                <FounderVerdictV2 report={founderReport} />
                <div className="mx-auto mt-8 flex max-w-5xl justify-center">
                  <button
                    onClick={handleNewInvestigation}
                    className="inline-flex h-12 items-center gap-2 rounded-[20px] bg-[#4A9B7F] px-8 font-mono text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#3D8A6E]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    NEW FOUNDER ANALYSIS
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Investigation log — collapsible drawer on right side */}
      <div className="fixed bottom-0 right-0 z-50 w-80 max-w-[90vw]">
        <button
          onClick={() => setLogOpen(!logOpen)}
          className="flex w-full items-center justify-between rounded-tl-[12px] border-t border-l border-[#E5E2DD] bg-white px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#81B09A] transition-colors hover:text-[#6A9580]"
        >
          <span>▸ {logLabel}</span>
          {logOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        {logOpen && (
          <div className="max-h-[250px] overflow-y-auto border-l border-t border-[#E5E2DD] bg-white px-4 py-3 font-mono text-[11px]">
            {logs.map((log, i) => (
              <div key={i} className="leading-5 text-[#6B6A69]">
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}
      </div>
    </main>
  );
}
