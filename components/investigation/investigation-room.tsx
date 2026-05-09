"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronDown, ChevronUp, Share2, Clock } from "lucide-react";
import { Corkboard } from "./corkboard";
import { FinalVerdict } from "./final-verdict";
import { PremortemVerdict } from "./premortem-verdict";
import { FounderVerdict } from "./founder-verdict";
import { CounterfactualVerdictComponent } from "./counterfactual-verdict";
import { DebateRoom } from "./debate-room";
import type { AgentFinding, AgentRole, AgentStatus, PostmortemReport, PremortemFinding, PremortemReport, FounderFinding, FounderReport, CounterfactualAgentFinding, CounterfactualReport, CounterfactualInput, InvestigationMode, AgentDebateOutput } from "@/types/investigation";

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

const cfPresets: { label: string; subject: string; originalDecision: string; alternateDecision: string }[] = [
  { label: "Quibi → Mobile to TV", subject: "Quibi", originalDecision: "Launched as mobile-only streaming platform", alternateDecision: "Launched on TV and mobile simultaneously" },
  { label: "Blockbuster → Acquired Netflix", subject: "Blockbuster", originalDecision: "Declined to acquire Netflix for $50M in 2000", alternateDecision: "Acquired Netflix in 2000 and pivoted to streaming" },
  { label: "Theranos → Real Science", subject: "Theranos", originalDecision: "Falsified test results instead of building real technology", alternateDecision: "Hired a real scientific advisory board and built legitimate diagnostics" },
  { label: "WeWork → Stayed Private", subject: "WeWork", originalDecision: "Aggressively expanded and pursued a disastrous IPO", alternateDecision: "Stayed private and grew slowly with sustainable unit economics" },
  { label: "Kodak → Embraced Digital", subject: "Kodak", originalDecision: "Suppressed digital photography to protect film business", alternateDecision: "Embraced digital photography and led the market transition" },
  { label: "Yahoo → Acquired Google", subject: "Yahoo", originalDecision: "Passed on acquiring Google for $5B in 2002", alternateDecision: "Acquired Google in 2002 and built a search powerhouse" },
  { label: "MySpace → Better Tech", subject: "MySpace", originalDecision: "Neglected platform technology and user experience", alternateDecision: "Invested heavily in technology rebuild and clean user experience" },
  { label: "Juicero → Went Direct", subject: "Juicero", originalDecision: "Built an over-engineered $400 WiFi-connected juicer", alternateDecision: "Built a simple direct-to-consumer juice brand without the hardware" },
];

const MODE_LOADING_MESSAGES: Record<InvestigationMode, string> = {
  postmortem: "DEPLOYING INVESTIGATORS...",
  premortem: "SCANNING FOR RISK SIGNALS...",
  founder: "ANALYZING VIABILITY...",
  counterfactual: "ENTERING ALTERNATE TIMELINE...",
};

interface CaseHistoryEntry {
  mode: InvestigationMode;
  subject: string;
  timestamp: number;
  originalDecision?: string;
  alternateDecision?: string;
}

function loadCaseHistory(): CaseHistoryEntry[] {
  try {
    const raw = localStorage.getItem("autopsy_case_history");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
}

function saveCaseHistory(entry: CaseHistoryEntry) {
  try {
    const history = loadCaseHistory();
    history.unshift(entry);
    const trimmed = history.slice(0, 5);
    localStorage.setItem("autopsy_case_history", JSON.stringify(trimmed));
  } catch { /* ignore */ }
}

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

function makeEmptyCFFindings(): Record<AgentRole, CounterfactualAgentFinding | null> {
  return Object.fromEntries(AGENT_ROLES.map((r) => [r, null])) as Record<AgentRole, CounterfactualAgentFinding | null>;
}

function makeEmptyStatuses(): Record<AgentRole, AgentStatus> {
  return Object.fromEntries(AGENT_ROLES.map((r) => [r, "idle"])) as Record<AgentRole, AgentStatus>;
}

export function InvestigationRoom() {
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
  const [cfAgentFindings, setCfAgentFindings] = useState<Record<AgentRole, CounterfactualAgentFinding | null>>(makeEmptyCFFindings);
  const [cfReport, setCfReport] = useState<CounterfactualReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [debateOutputs, setDebateOutputs] = useState<AgentDebateOutput[]>([]);
  const [debateStarted, setDebateStarted] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [caseNumber] = useState(generateCaseNumber);
  const [caseHistory, setCaseHistory] = useState<CaseHistoryEntry[]>([]);
  const [loadingMsg, setLoadingMsg] = useState<string>("");
  const [shareCopied, setShareCopied] = useState(false);

  // Founder form fields
  const [founderName, setFounderName] = useState("");
  const [founderDescription, setFounderDescription] = useState("");
  const [founderStage, setFounderStage] = useState("MVP");
  const [founderTargetCustomer, setFounderTargetCustomer] = useState("");

  // Counterfactual form fields
  const [cfOriginalDecision, setCfOriginalDecision] = useState("");
  const [cfAlternateDecision, setCfAlternateDecision] = useState("");
  const [cfContext, setCfContext] = useState("");

  const hasAutoTriggered = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);
  const verdictRef = useRef<HTMLDivElement | null>(null);
  const cfInputRef = useRef<HTMLDivElement | null>(null);
  const cfAltInputRef = useRef<HTMLInputElement | null>(null);

  function addLog(msg: string) {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`]);
  }

  useEffect(() => {
    if (logOpen) logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, logOpen]);

  useEffect(() => {
    if (report || premortemReport || founderReport || cfReport) {
      setTimeout(() => verdictRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [report, premortemReport, founderReport, cfReport]);

  useEffect(() => {
    const s = searchParams.get("subject");
    if (s) setSubject(s);
    const m = searchParams.get("mode");
    if (m === "counterfactual" || m === "postmortem" || m === "premortem" || m === "founder") {
      setMode(m as InvestigationMode);
    }
    const orig = searchParams.get("originalDecision");
    if (orig) setCfOriginalDecision(orig);
    const alt = searchParams.get("alternateDecision");
    if (alt) setCfAlternateDecision(alt);
    const ctx = searchParams.get("context");
    if (ctx) setCfContext(ctx);
  }, [searchParams]);

  useEffect(() => {
    const s = searchParams.get("subject");
    const m = searchParams.get("mode");
    if (s && !hasAutoTriggered.current) {
      hasAutoTriggered.current = true;
      const timer = setTimeout(() => {
        startInvestigation(s);
      }, m === "counterfactual" ? 800 : 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Load case history on mount
  useEffect(() => {
    setCaseHistory(loadCaseHistory());
  }, []);

  const startInvestigation = useCallback(async (subj: string) => {
    if (!subj.trim()) return;

    const currentMode = mode;
    setIsInvestigating(true);
    setError(null);
    setReport(null);
    setPremortemReport(null);
    setFounderReport(null);
    setCfReport(null);
    setLogs([]);
    setDebateOutputs([]);
    setDebateStarted(false);

    setAgentStatuses(
      Object.fromEntries(AGENT_ROLES.map((r) => [r, "researching"])) as Record<AgentRole, AgentStatus>
    );
    setAgentFindings(makeEmptyFindings());
    setPremortemFindings(makeEmptyPremortemFindings());
    setFounderFindings(makeEmptyFounderFindings());
    setCfAgentFindings(makeEmptyCFFindings());

    addLog("Checking API connection...");
    setLoadingMsg(MODE_LOADING_MESSAGES[currentMode]);
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
    } else if (currentMode === "counterfactual") {
      apiEndpoint = "/api/counterfactual";
      requestBody = {
        subject: subj,
        originalDecision: cfOriginalDecision.trim(),
        alternateDecision: cfAlternateDecision.trim(),
        context: cfContext.trim() || undefined,
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

              if (type === "cf_agent_started" && data?.role) {
                addLog("Agent deployed to alternate timeline: " + data.role);
                setAgentStatuses((prev) => ({
                  ...prev,
                  [data.role as AgentRole]: "analyzing",
                }));
              }

              if (type === "cf_agent_update" && data?.role) {
                const cfFinding = {
                  role: data.role,
                  displayName: data.displayName,
                  status: data.status || "done",
                  actualOutcome: data.actualOutcome || "",
                  alternateOutcome: data.alternateOutcome || "",
                  wouldItHaveHelped: data.wouldItHaveHelped ?? true,
                  confidenceInAlterate: data.confidenceInAlterate || data.confidence || 70,
                  reasoning: data.reasoning || "",
                  historicalPrecedents: data.historicalPrecedents || [],
                  sources: data.sources || [],
                };
                addLog("CF Agent done: " + cfFinding.displayName + " | Verdict: " + (cfFinding.wouldItHaveHelped ? "WOULD HAVE HELPED" : "WOULDN'T HAVE MATTERED"));
                setCfAgentFindings((prev) => ({ ...prev, [data.role as AgentRole]: cfFinding }));
                setAgentFindings((prev) => ({
                  ...prev,
                  [data.role as AgentRole]: {
                    role: data.role, displayName: data.displayName, status: data.status || "done",
                    primaryCause: cfFinding.wouldItHaveHelped ? "Would have helped" : "Wouldn't have mattered",
                    evidence: cfFinding.historicalPrecedents, confidence: cfFinding.confidenceInAlterate / 100,
                    fullAnalysis: cfFinding.reasoning, sources: cfFinding.sources,
                  },
                }));
                setAgentStatuses((prev) => ({ ...prev, [data.role as AgentRole]: data.status || "done" }));
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
                } else if (currentMode === "counterfactual") {
                  // CF mode uses cf_complete, not complete
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

              if (type === "cf_complete") {
                const cfRpt = data as CounterfactualReport;
                setCfReport(cfRpt);
                if (cfRpt.agentFindings) {
                  const cfMap = {} as Record<AgentRole, CounterfactualAgentFinding | null>;
                  for (const af of cfRpt.agentFindings) cfMap[af.role as AgentRole] = af;
                  setCfAgentFindings((prev) => ({ ...prev, ...cfMap }));
                }
                addLog("Alternate timeline analysis complete — report ready");
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

    setLoadingMsg("");
    saveCaseHistory({ mode: currentMode, subject: subj, timestamp: Date.now(), originalDecision: currentMode === "counterfactual" ? cfOriginalDecision : undefined, alternateDecision: currentMode === "counterfactual" ? cfAlternateDecision : undefined });
    setCaseHistory(loadCaseHistory());

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

  const handleCFStart = useCallback(() => {
    if (!subject.trim() || !cfOriginalDecision.trim() || !cfAlternateDecision.trim()) return;
    startInvestigation(subject);
  }, [subject, cfOriginalDecision, cfAlternateDecision, startInvestigation]);

  const handleBridgeToCF = useCallback((origDecision?: string) => {
    setMode("counterfactual");
    if (origDecision) setCfOriginalDecision(origDecision);
    setCfReport(null);
    setIsInvestigating(false);
    setLogs([]);
    setAgentFindings(makeEmptyFindings());
    setPremortemFindings(makeEmptyPremortemFindings());
    setFounderFindings(makeEmptyFounderFindings());
    setCfAgentFindings(makeEmptyCFFindings());
    setAgentStatuses(makeEmptyStatuses());
    setError(null);
    setTimeout(() => {
      cfAltInputRef.current?.focus();
      cfInputRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }, []);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    setIsInvestigating(false);
    addLog("Investigation cancelled by user");
  }, []);

  // Keyboard shortcuts: 1-4 switch modes, Escape cancels
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isInvestigating) {
        if (e.key === "Escape") handleCancel();
        return;
      }
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;
      if (e.key === "1") setMode("postmortem");
      else if (e.key === "2") setMode("premortem");
      else if (e.key === "3") setMode("founder");
      else if (e.key === "4") setMode("counterfactual");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isInvestigating, handleCancel]);

  const handleNewInvestigation = useCallback(() => {
    setReport(null);
    setPremortemReport(null);
    setFounderReport(null);
    setCfReport(null);
    setError(null);
    setIsInvestigating(false);
    setLogs([]);
    setDebateOutputs([]);
    setDebateStarted(false);
    setAgentFindings(makeEmptyFindings());
    setPremortemFindings(makeEmptyPremortemFindings());
    setFounderFindings(makeEmptyFounderFindings());
    setCfAgentFindings(makeEmptyCFFindings());
    setAgentStatuses(makeEmptyStatuses());
  }, []);

  const handleShare = useCallback(() => {
    let url = `${window.location.origin}/investigate?mode=${mode}&subject=${encodeURIComponent(subject)}`;
    if (mode === "counterfactual") {
      url += `&originalDecision=${encodeURIComponent(cfOriginalDecision)}&alternateDecision=${encodeURIComponent(cfAlternateDecision)}`;
    }
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  }, [mode, subject, cfOriginalDecision, cfAlternateDecision]);

  const activeExamples = mode === "founder" || mode === "counterfactual" ? [] : mode === "premortem" ? premortemExamples : postmortemExamples;
  const placeholder = mode === "founder" || mode === "counterfactual"
    ? ""
    : mode === "premortem"
      ? "Cursor, Notion, Linear, Anthropic, your startup..."
      : "e.g. Quibi, Theranos, Google Glass, your startup...";
  const logLabel = mode === "founder"
    ? "FOUNDER MODE LOG"
    : mode === "premortem"
      ? "PRE-MORTEM LOG"
      : mode === "counterfactual"
        ? "COUNTERFACTUAL LOG"
        : "INVESTIGATION LOG";

  const founderFormValid = founderName.trim() && founderDescription.trim();
  const cfFormValid = subject.trim() && cfOriginalDecision.trim() && cfAlternateDecision.trim();

  return (
    <main className="min-h-dvh bg-[#0E0E0E] text-[#F4F1EA]">
      {/* Yellow case header stripe */}
      {isInvestigating && (
        <div className={`px-6 py-2 sm:px-12 ${mode === "counterfactual" ? "bg-[#FACC15]" : "bg-[#FFD60A]"}`}>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#0E0E0E]">
            {mode === "counterfactual" ? "COUNTERFACTUAL ANALYSIS / ALTERNATE TIMELINE" : "CASE FILE / INVESTIGATION IN PROGRESS"}
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex items-center justify-between border-b border-[#2A2A2A] px-6 py-4 sm:px-12">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-wider text-[#71706B] transition-colors hover:text-[#F4F1EA]"
        >
          ← BACK
        </Link>
        <span className="font-mono text-lg font-bold tracking-wider text-[#D62828]">
          AUTOPSY
        </span>
        <Link
          href="/investigate"
          className="font-mono text-[11px] uppercase tracking-wider border border-[#D62828] px-3 py-1.5 text-[#D62828] transition-colors hover:bg-[#D62828] hover:text-white"
        >
          LAUNCH ▸
        </Link>
      </nav>

      {/* Mode-specific loading banner */}
      {isInvestigating && loadingMsg && !report && !premortemReport && !founderReport && !cfReport && (
        <div className="border-b border-[#2A2A2A] bg-[#0E0E0E] px-6 py-2 sm:px-12">
          <p className="mx-auto max-w-5xl font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#71706B] animate-pulse">
            {loadingMsg}
          </p>
        </div>
      )}

      {/* Case metadata strip (when investigating) */}
      {isInvestigating && (
        <div className="border-b border-[#2A2A2A] bg-[#0E0E0E] px-6 py-3 sm:px-12">
          {mode === "counterfactual" ? (
            <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-1 font-mono text-[11px] uppercase tracking-wider">
              <span className="text-[#71706B]">SUBJECT: <span className="text-[#FACC15]">{subject}</span></span>
              <span className="text-[#71706B]">ORIGINAL PATH: <span className="text-[#B8B5AE]">{cfOriginalDecision.slice(0, 30)}</span></span>
              <span className="text-[#71706B]">ALTERNATE PATH: <span className="text-[#FACC15]">{cfAlternateDecision.slice(0, 30)}</span></span>
              <span className="text-[#71706B]">INVESTIGATORS: <span className="text-[#F4F1EA]">6 / DEPLOYED</span></span>
            </div>
          ) : (
            <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-1 font-mono text-[11px] uppercase tracking-wider">
              <span className="text-[#71706B]">CASE #: <span className="text-[#F4F1EA]">{caseNumber}</span></span>
              <span className="text-[#71706B]">SUBJECT: <span className="text-[#D62828]">{subject}</span></span>
              <span className="text-[#71706B]">INVESTIGATORS: <span className="text-[#F4F1EA]">6 / DEPLOYED</span></span>
              <span className="text-[#71706B]">OPENED: <span className="text-[#F4F1EA]">{new Date().toLocaleTimeString()}</span></span>
            </div>
          )}
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
            {/* Mode toggle — 4 segments */}
            <div className="mb-12 flex w-full max-w-lg">
              <button
                onClick={() => setMode("postmortem")}
                className={`flex-1 border-2 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  mode === "postmortem"
                    ? "border-[#D62828] bg-[#0E0E0E] text-[#F4F1EA]"
                    : "border-[#2A2A2A] bg-[#161616] text-[#71706B] hover:text-[#B8B5AE]"
                }`}
              >
                Postmortem
              </button>
              <button
                onClick={() => setMode("premortem")}
                className={`flex-1 border-2 border-l-0 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  mode === "premortem"
                    ? "border-[#FFD60A] bg-[#0E0E0E] text-[#FFD60A]"
                    : "border-[#2A2A2A] bg-[#161616] text-[#71706B] hover:text-[#B8B5AE]"
                }`}
              >
                Pre-Mortem
              </button>
              <button
                onClick={() => setMode("founder")}
                className={`flex-1 border-2 border-l-0 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  mode === "founder"
                    ? "border-[#06D6A0] bg-[#0E0E0E] text-[#06D6A0]"
                    : "border-[#2A2A2A] bg-[#161616] text-[#71706B] hover:text-[#B8B5AE]"
                }`}
              >
                Founder Mode
              </button>
              <button
                onClick={() => setMode("counterfactual")}
                className={`flex-1 border-2 border-l-0 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  mode === "counterfactual"
                    ? "border-[#FACC15] bg-[#0E0E0E] text-[#FACC15]"
                    : "border-[#2A2A2A] bg-[#161616] text-[#71706B] hover:text-[#B8B5AE]"
                }`}
              >
                Counterfactual
              </button>
            </div>

            {/* Keyboard shortcut hints */}
            <p className="mb-8 text-center font-mono text-[10px] uppercase tracking-wider text-[#5C5852]">
              [1] POSTMORTEM &nbsp; [2] PRE-MORTEM &nbsp; [3] FOUNDER &nbsp; [4] COUNTERFACTUAL &nbsp; [ESC] CANCEL
            </p>

            <h1 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#F4F1EA] sm:text-5xl" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
              {mode === "founder" ? "Will your idea survive?" : mode === "premortem" ? "What could kill it?" : mode === "counterfactual" ? "What if they chose differently?" : "What failed?"}
            </h1>
            <p className="mb-12 text-center text-[#B8B5AE]">
              {mode === "founder"
                ? "6 agents stress-test your startup idea before you quit your day job"
                : mode === "premortem"
                  ? "6 agents assess risks and predict what could go wrong"
                  : mode === "counterfactual"
                    ? "6 agents investigate an alternate timeline — what if they made a different decision?"
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
                    <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#71706B]">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full border-b-2 border-[#3F3F3F] bg-transparent px-1 py-3 font-mono text-sm text-[#F4F1EA] placeholder-[#5C5852] outline-none transition-colors focus:border-[#06D6A0]"
                      />
                    ) : (
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        placeholder={field.placeholder}
                        className="h-12 w-full border-b-2 border-[#3F3F3F] bg-transparent px-1 font-mono text-sm text-[#F4F1EA] placeholder-[#5C5852] outline-none transition-colors focus:border-[#06D6A0]"
                      />
                    )}
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#71706B]">
                      STAGE
                    </label>
                    <select
                      value={founderStage}
                      onChange={(e) => setFounderStage(e.target.value)}
                      className="h-12 w-full border-b-2 border-[#3F3F3F] bg-transparent px-1 font-mono text-sm text-[#F4F1EA] outline-none transition-colors focus:border-[#06D6A0]"
                    >
                      {STAGES.map((s) => <option key={s} value={s} className="bg-[#161616]">{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#71706B]">
                      TARGET CUSTOMER (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={founderTargetCustomer}
                      onChange={(e) => setFounderTargetCustomer(e.target.value)}
                      placeholder="e.g. 'SMB owners'"
                      className="h-12 w-full border-b-2 border-[#3F3F3F] bg-transparent px-1 font-mono text-sm text-[#F4F1EA] placeholder-[#5C5852] outline-none transition-colors focus:border-[#06D6A0]"
                    />
                  </div>
                </div>
                <button
                  onClick={handleFounderStart}
                  disabled={!founderFormValid}
                  className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 border-2 border-[#06D6A0] bg-[#06D6A0] px-8 font-mono text-sm font-bold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#05B88A] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  RUN FOUNDER MODE ▸
                </button>
              </div>
            ) : mode === "counterfactual" ? (
              /* Counterfactual Mode — structured form */
              <div ref={cfInputRef} className="w-full space-y-5">
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#71706B]">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Quibi, Theranos, Blockbuster..."
                    className="h-12 w-full border-b-2 border-[#3F3F3F] bg-transparent px-1 font-mono text-sm text-[#F4F1EA] placeholder-[#5C5852] outline-none transition-colors focus:border-[#FACC15]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#71706B]">
                    THE ORIGINAL DECISION
                  </label>
                  <input
                    type="text"
                    value={cfOriginalDecision}
                    onChange={(e) => setCfOriginalDecision(e.target.value)}
                    placeholder="Launched as mobile-only"
                    className="h-12 w-full border-b-2 border-[#3F3F3F] bg-transparent px-1 font-mono text-sm text-[#F4F1EA] placeholder-[#5C5852] outline-none transition-colors focus:border-[#FACC15]"
                  />
                  <p className="mt-1 font-mono text-[10px] text-[#5C5852]">
                    What did they actually do that you think was wrong?
                  </p>
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#71706B]">
                    THE ALTERNATE DECISION
                  </label>
                  <input
                    ref={cfAltInputRef}
                    type="text"
                    value={cfAlternateDecision}
                    onChange={(e) => setCfAlternateDecision(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCFStart()}
                    placeholder="Launched on TV and mobile simultaneously"
                    className="h-12 w-full border-b-2 border-[#3F3F3F] bg-transparent px-1 font-mono text-sm text-[#F4F1EA] placeholder-[#5C5852] outline-none transition-colors focus:border-[#FACC15]"
                  />
                  <p className="mt-1 font-mono text-[10px] text-[#5C5852]">
                    The &ldquo;what if&rdquo; — what&apos;s the alternate path?
                  </p>
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#71706B]">
                    ADDITIONAL CONTEXT (OPTIONAL)
                  </label>
                  <textarea
                    value={cfContext}
                    onChange={(e) => setCfContext(e.target.value)}
                    placeholder="Year this happened, relevant market context..."
                    rows={2}
                    className="w-full border-b-2 border-[#3F3F3F] bg-transparent px-1 py-3 font-mono text-sm text-[#F4F1EA] placeholder-[#5C5852] outline-none transition-colors focus:border-[#FACC15]"
                  />
                </div>

                {/* Preset chips */}
                <div className="pt-2">
                  <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#71706B]">
                    OR: CHOOSE A FAMOUS WHAT-IF
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cfPresets.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          setSubject(preset.subject);
                          setCfOriginalDecision(preset.originalDecision);
                          setCfAlternateDecision(preset.alternateDecision);
                        }}
                        className="border border-[#3F3F3F] bg-[#161616] px-3 py-1.5 font-mono text-xs text-[#B8B5AE] transition-colors hover:border-[#FACC15]/50 hover:text-[#F4F1EA]"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCFStart}
                  disabled={!cfFormValid}
                  className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 border-2 border-[#FACC15] bg-[#FACC15] px-8 font-mono text-sm font-bold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6B800] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  BEGIN COUNTERFACTUAL ANALYSIS ▸
                </button>
              </div>
            ) : (
              /* Postmortem / Premortem — terminal-style input */
              <div className="w-full">
                <div className="border-2 border-[#3F3F3F] bg-[#161616] p-1">
                  <div className="flex items-center">
                    <span className="px-3 font-mono text-sm text-[#D62828]">▸</span>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleStart()}
                      placeholder={placeholder}
                      className="h-14 flex-1 bg-transparent font-mono text-sm text-[#F4F1EA] placeholder-[#5C5852] outline-none"
                    />
                  </div>
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#71706B]">
                  Press Enter to begin
                </p>

                {/* Example cases */}
                <div className="mt-10">
                  <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#71706B]">
                    EXAMPLE CASES:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeExamples.map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setSubject(ex)}
                        className="border border-[#3F3F3F] bg-[#161616] px-3 py-1.5 font-mono text-xs text-[#B8B5AE] transition-colors hover:border-[#D62828]/50 hover:text-[#F4F1EA]"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent case history */}
            {caseHistory.length > 0 && (
              <div className="mt-16 w-full max-w-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-[#5C5852]" />
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#71706B]">
                    RECENT CASES
                  </p>
                </div>
                <div className="mt-3 space-y-2">
                  {caseHistory.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setMode(c.mode);
                        setSubject(c.subject);
                        if (c.mode === "counterfactual" && c.originalDecision) {
                          setCfOriginalDecision(c.originalDecision);
                          setCfAlternateDecision(c.alternateDecision || "");
                        }
                      }}
                      className="flex w-full items-center justify-between border border-[#2A2A2A] bg-[#161616] px-4 py-2.5 font-mono text-xs transition-colors hover:border-[#3F3F3F] hover:text-[#F4F1EA]"
                    >
                      <span className="flex items-center gap-3">
                        <span className={`uppercase tracking-wider ${
                          c.mode === "counterfactual" ? "text-[#FACC15]" : c.mode === "premortem" ? "text-[#FFD60A]" : c.mode === "founder" ? "text-[#06D6A0]" : "text-[#D62828]"
                        }`}>
                          {c.mode === "counterfactual" ? "CF" : c.mode === "premortem" ? "PM" : c.mode === "founder" ? "FO" : "PO"}
                        </span>
                        <span className="text-[#B8B5AE]">{c.subject}</span>
                      </span>
                      <span className="text-[#5C5852]">
                        {new Date(c.timestamp).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
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
              <div className="mx-auto mb-6 max-w-5xl border border-[#D62828]/30 bg-[#D62828]/5 px-5 py-4 font-mono text-sm text-[#D62828]">
                ERROR: {error}
              </div>
            )}

            <Corkboard
              subject={subject}
              agentRoles={AGENT_ROLES}
              agentFindings={agentFindings}
              premortemFindings={premortemFindings}
              founderFindings={founderFindings}
              counterfactualFindings={cfAgentFindings}
              agentStatuses={agentStatuses}
              mode={mode}
              onCancel={!report && !premortemReport && !founderReport && !cfReport ? handleCancel : undefined}
            />

            {/* Debate Room — appears after debate_complete for postmortem mode */}
            {mode === "postmortem" && (debateOutputs.length > 0 || debateStarted) && !report && (
              <DebateRoom debate={debateOutputs} />
            )}

            {report && mode === "postmortem" && (
              <div ref={verdictRef}>
                <FinalVerdict report={report} />
                <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center gap-4">
                  <button
                    onClick={() => handleBridgeToCF(report.primaryCauseOfDeath)}
                    className="inline-flex h-12 items-center gap-2 border-2 border-[#FACC15] px-8 font-mono text-sm font-bold uppercase tracking-wider text-[#FACC15] transition-colors hover:bg-[#FACC15]/10"
                  >
                    ▸ EXPLORE COUNTERFACTUAL: What if they had made a different decision?
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={handleShare}
                      className="inline-flex h-12 items-center gap-2 border-2 border-[#71706B] px-6 font-mono text-xs font-bold uppercase tracking-wider text-[#71706B] transition-colors hover:border-[#F4F1EA] hover:text-[#F4F1EA]"
                    >
                      <Share2 className="h-4 w-4" />
                      {shareCopied ? "COPIED!" : "SHARE THIS INVESTIGATION"}
                    </button>
                    <button
                      onClick={handleNewInvestigation}
                      className="inline-flex h-12 items-center gap-2 border-2 border-[#D62828] bg-[#D62828] px-8 font-mono text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#B91C1C]"
                    >
                      <RotateCcw className="h-4 w-4" />
                      NEW INVESTIGATION
                    </button>
                  </div>
                </div>
              </div>
            )}

            {premortemReport && mode === "premortem" && (
              <div ref={verdictRef}>
                <PremortemVerdict report={premortemReport} />
                <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center gap-4">
                  <button
                    onClick={() => handleBridgeToCF(premortemReport.topThreatToSurvival)}
                    className="inline-flex h-12 items-center gap-2 border-2 border-[#FACC15] px-8 font-mono text-sm font-bold uppercase tracking-wider text-[#FACC15] transition-colors hover:bg-[#FACC15]/10"
                  >
                    ▸ TEST A COUNTERFACTUAL AGAINST THIS RISK
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={handleShare}
                      className="inline-flex h-12 items-center gap-2 border-2 border-[#71706B] px-6 font-mono text-xs font-bold uppercase tracking-wider text-[#71706B] transition-colors hover:border-[#F4F1EA] hover:text-[#F4F1EA]"
                    >
                      <Share2 className="h-4 w-4" />
                      {shareCopied ? "COPIED!" : "SHARE THIS INVESTIGATION"}
                    </button>
                    <button
                      onClick={handleNewInvestigation}
                      className="inline-flex h-12 items-center gap-2 border-2 border-[#FFD60A] bg-[#FFD60A] px-8 font-mono text-sm font-bold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6C000]"
                    >
                      <RotateCcw className="h-4 w-4" />
                      NEW PRE-MORTEM
                    </button>
                  </div>
                </div>
              </div>
            )}

            {founderReport && mode === "founder" && (
              <div ref={verdictRef}>
                <FounderVerdict report={founderReport} />
                <div className="mx-auto mt-8 flex max-w-5xl justify-center gap-3">
                  <button
                    onClick={handleShare}
                    className="inline-flex h-12 items-center gap-2 border-2 border-[#71706B] px-6 font-mono text-xs font-bold uppercase tracking-wider text-[#71706B] transition-colors hover:border-[#F4F1EA] hover:text-[#F4F1EA]"
                  >
                    <Share2 className="h-4 w-4" />
                    {shareCopied ? "COPIED!" : "SHARE THIS INVESTIGATION"}
                  </button>
                  <button
                    onClick={handleNewInvestigation}
                    className="inline-flex h-12 items-center gap-2 border-2 border-[#06D6A0] bg-[#06D6A0] px-8 font-mono text-sm font-bold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#05B88A]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    NEW FOUNDER ANALYSIS
                  </button>
                </div>
              </div>
            )}

            {cfReport && mode === "counterfactual" && (
              <div ref={verdictRef}>
                <CounterfactualVerdictComponent report={cfReport} />
                <div className="mx-auto mt-8 flex max-w-5xl justify-center gap-3">
                  <button
                    onClick={handleShare}
                    className="inline-flex h-12 items-center gap-2 border-2 border-[#71706B] px-6 font-mono text-xs font-bold uppercase tracking-wider text-[#71706B] transition-colors hover:border-[#F4F1EA] hover:text-[#F4F1EA]"
                  >
                    <Share2 className="h-4 w-4" />
                    {shareCopied ? "COPIED!" : "SHARE THIS INVESTIGATION"}
                  </button>
                  <button
                    onClick={handleNewInvestigation}
                    className="inline-flex h-12 items-center gap-2 border-2 border-[#FACC15] bg-[#FACC15] px-8 font-mono text-sm font-bold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6B800]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    NEW COUNTERFACTUAL
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
          className="flex w-full items-center justify-between border-t border-l border-[#2A2A2A] bg-[#0E0E0E] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#D62828] transition-colors hover:text-[#F4F1EA]"
        >
          <span>▸ {logLabel}</span>
          {logOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        {logOpen && (
          <div className="max-h-[250px] overflow-y-auto border-l border-t border-[#2A2A2A] bg-[#0E0E0E] px-4 py-3 font-mono text-[11px]">
            {logs.map((log, i) => (
              <div key={i} className="leading-5 text-[#5C5852]">
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
