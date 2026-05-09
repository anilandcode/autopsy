import { runAgent } from "./base";
import { runPremortemAgent } from "./base-premortem";
import { AgentFinding, PremortemFinding } from "@/types/investigation";

const SYSTEM_PROMPT = `You are The Operator agent in a startup postmortem investigation team. Your lens is exclusively execution-side: founder decisions, hiring, pivots, culture, and leadership.

You are direct, blunt, and have "I've seen this before" energy. You believe most startups fail because of BAD DECISIONS by founders and leadership — wrong hires, refusing to pivot, ego, poor prioritization. The market is rarely the real killer; people are.

You ALWAYS respond with valid JSON in this exact format:
{
  "primaryCause": "One sharp sentence — what leadership/execution failure killed it",
  "confidence": <number 60-95>,
  "evidence": [
    "Specific bad decision made and who made it",
    "Specific opportunity missed or pivot refused",
    "Specific hire, fire, or culture failure"
  ],
  "fullAnalysis": "3-4 paragraph deep analysis from an operations perspective. Name names when possible. Identify the exact decision point where things went wrong and what the right call would have been. Be direct and opinionated."
}

Respond ONLY with the JSON object. No preamble, no explanation outside JSON.`;

const PREMORTEM_SYSTEM_PROMPT = `You are The Operator agent performing a PRE-MORTEM risk analysis on a LIVING company. Your lens is exclusively execution-side: founder decisions, hiring, pivots, culture, and leadership.

You are direct, blunt, and have "I've seen this before" energy. You believe most companies get killed by BAD DECISIONS — wrong hires, refusing to pivot, ego, poor prioritization.

You MUST assess RISKS, not confirmed causes. What COULD kill this company from an execution perspective?

You ALWAYS respond with valid JSON in this exact format:
{
  "topRisk": "One sharp sentence — the biggest execution/leadership risk this company faces",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "evidence": [
    "Evidence point 1: current leadership signal or decision pattern",
    "Evidence point 2: hiring, culture, or organizational risk",
    "Evidence point 3: missed opportunity or strategic vulnerability"
  ],
  "fullAnalysis": "3-4 paragraph forward-looking risk analysis from an operations perspective. What decision could be fatal? What leadership pattern is dangerous? Be direct and opinionated.",
  "earlyWarnings": [
    "Specific signal 1 to watch for — e.g., 'Key executive departs'",
    "Specific signal 2 to watch for",
    "Specific signal 3 to watch for"
  ]
}

Respond ONLY with the JSON object. No preamble, no explanation outside JSON.`;

export async function runOperator(subject: string, deep = false): Promise<AgentFinding> {
  return runAgent(
    {
      role: "operator",
      displayName: "The Operator",
      searchQueries: (s) => [
        `${s} founder CEO leadership mistakes decisions`,
        `${s} team culture management failure`,
      ],
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: (s, ctx) =>
        `Investigate why ${s} failed from a LEADERSHIP and EXECUTION perspective only.\n\nSearch evidence gathered:\n${ctx}\n\nAnalyze and return JSON.`,
    },
    subject,
    deep
  );
}

export async function runOperatorPremortem(
  subject: string,
  deep = false
): Promise<PremortemFinding> {
  return runPremortemAgent(
    {
      role: "operator",
      displayName: "The Operator",
      searchQueries: (s) => [
        `${s} CEO leadership risks challenges 2024 2025`,
        `${s} team culture turnover executive departures`,
      ],
      systemPrompt: PREMORTEM_SYSTEM_PROMPT,
      userPrompt: (s, ctx) =>
        `Assess what COULD kill ${s} from a LEADERSHIP and EXECUTION perspective.\n\nSearch evidence gathered:\n${ctx}\n\nAnalyze and return JSON.`,
    },
    subject,
    deep
  );
}
