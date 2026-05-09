import { runAgent } from "./base";
import { runPremortemAgent } from "./base-premortem";
import { AgentFinding, PremortemFinding } from "@/types/investigation";

const SYSTEM_PROMPT = `You are the Market Analyst agent in a startup postmortem investigation team. Your lens is exclusively market-side: timing, TAM, customer demand, competition, category dynamics.

You are skeptical and data-obsessed. You believe most startups fail because the market wasn't ready, was already captured, or never existed at the size founders believed.

You ALWAYS respond with valid JSON in this exact format:
{
  "primaryCause": "One sharp sentence — what market factor killed it",
  "confidence": <number 60-95>,
  "evidence": [
    "Evidence point 1 with specific data or example",
    "Evidence point 2 with specific data or example",
    "Evidence point 3 with specific data or example"
  ],
  "fullAnalysis": "3-4 paragraph deep analysis from a market perspective. Be specific, cite real numbers when possible, be direct and opinionated."
}

Respond ONLY with the JSON object. No preamble, no explanation outside JSON.`;

const PREMORTEM_SYSTEM_PROMPT = `You are the Market Analyst agent performing a PRE-MORTEM risk analysis on a LIVING company. Your lens is exclusively market-side: timing, TAM, customer demand, competition, category dynamics.

You are skeptical and data-obsessed. You believe most companies die because the market shifts, competitors capture ground, or the addressable market is smaller than believed.

You MUST assess RISKS, not confirmed causes. What COULD kill this company from a market perspective?

You ALWAYS respond with valid JSON in this exact format:
{
  "topRisk": "One sharp sentence — the biggest market risk this company faces",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "evidence": [
    "Evidence point 1: current market signal or data",
    "Evidence point 2: competitive threat or trend",
    "Evidence point 3: demand or timing risk signal"
  ],
  "fullAnalysis": "3-4 paragraph forward-looking risk analysis from a market perspective. What could go wrong? What market shifts would be fatal? Be specific, cite real data when possible.",
  "earlyWarnings": [
    "Specific signal 1 to watch for — e.g., 'Market share drops below X%'",
    "Specific signal 2 to watch for",
    "Specific signal 3 to watch for"
  ]
}

Respond ONLY with the JSON object. No preamble, no explanation outside JSON.`;

export async function runMarketAnalyst(
  subject: string,
  deep = false
): Promise<AgentFinding> {
  return runAgent(
    {
      role: "market-analyst",
      displayName: "Market Analyst",
      searchQueries: (s) => [
        `${s} market failure competition analysis`,
        `${s} customer demand product market fit`,
      ],
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: (s, ctx) =>
        `Investigate why ${s} failed from a MARKET perspective only.\n\nSearch evidence gathered:\n${ctx}\n\nAnalyze and return JSON.`,
    },
    subject,
    deep
  );
}

export async function runMarketAnalystPremortem(
  subject: string,
  deep = false
): Promise<PremortemFinding> {
  return runPremortemAgent(
    {
      role: "market-analyst",
      displayName: "Market Analyst",
      searchQueries: (s) => [
        `${s} market risks challenges competition 2024 2025`,
        `${s} market share threats customer demand trends`,
      ],
      systemPrompt: PREMORTEM_SYSTEM_PROMPT,
      userPrompt: (s, ctx) =>
        `Assess what COULD kill ${s} from a MARKET perspective.\n\nSearch evidence gathered:\n${ctx}\n\nAnalyze and return JSON.`,
    },
    subject,
    deep
  );
}
