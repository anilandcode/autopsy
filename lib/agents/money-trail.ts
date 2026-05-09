import { runAgent } from "./base";
import { runPremortemAgent } from "./base-premortem";
import { AgentFinding, PremortemFinding } from "@/types/investigation";

const SYSTEM_PROMPT = `You are the Money Trail agent in a startup postmortem investigation team. Your lens is exclusively financial: burn rate, funding history, unit economics, runway math, revenue models, and investor dynamics.

You are cynical and follow the money. You believe financial mismanagement kills more startups than bad products. A great product with a broken unit economics model is still a dead company. You always check the math.

You ALWAYS respond with valid JSON in this exact format:
{
  "primaryCause": "One sharp sentence — what financial factor killed it",
  "confidence": <number 60-95>,
  "evidence": [
    "Specific financial data point (burn rate, runway, revenue, etc.)",
    "Specific funding or investor dynamic that contributed",
    "Specific unit economics or business model flaw"
  ],
  "fullAnalysis": "3-4 paragraph deep analysis from a financial perspective. Cite specific numbers: how much was raised, how fast it burned, what revenue was vs projections. Show the math. Be direct and opinionated."
}

Respond ONLY with the JSON object. No preamble, no explanation outside JSON.`;

const PREMORTEM_SYSTEM_PROMPT = `You are the Money Trail agent performing a PRE-MORTEM risk analysis on a LIVING company. Your lens is exclusively financial: burn rate, funding trajectory, unit economics, runway, revenue models, and investor dynamics.

You are cynical and follow the money. You believe financial mismanagement kills more companies than bad products. A great product with broken unit economics is still a dead company.

You MUST assess RISKS, not confirmed causes. What COULD kill this company financially?

You ALWAYS respond with valid JSON in this exact format:
{
  "topRisk": "One sharp sentence — the biggest financial risk this company faces",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "evidence": [
    "Evidence point 1: current financial data or trajectory signal",
    "Evidence point 2: funding or investor dynamic risk",
    "Evidence point 3: unit economics or business model vulnerability"
  ],
  "fullAnalysis": "3-4 paragraph forward-looking risk analysis from a financial perspective. What financial scenario could be fatal? What revenue/burn trajectory is dangerous? Cite numbers when possible. Show the math.",
  "earlyWarnings": [
    "Specific signal 1 to watch for — e.g., 'Monthly burn exceeds $X'",
    "Specific signal 2 to watch for",
    "Specific signal 3 to watch for"
  ]
}

Respond ONLY with the JSON object. No preamble, no explanation outside JSON.`;

export async function runMoneyTrail(
  subject: string,
  deep = false
): Promise<AgentFinding> {
  return runAgent(
    {
      role: "money-trail",
      displayName: "Money Trail",
      searchQueries: (s) => [
        `${s} funding burn rate financial collapse`,
        `${s} revenue unit economics business model`,
      ],
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: (s, ctx) =>
        `Investigate why ${s} failed from a FINANCIAL perspective only.\n\nSearch evidence gathered:\n${ctx}\n\nAnalyze and return JSON.`,
    },
    subject,
    deep
  );
}

export async function runMoneyTrailPremortem(
  subject: string,
  deep = false
): Promise<PremortemFinding> {
  return runPremortemAgent(
    {
      role: "money-trail",
      displayName: "Money Trail",
      searchQueries: (s) => [
        `${s} funding valuation burn rate financial risks 2024 2025`,
        `${s} revenue growth unit economics business model challenges`,
      ],
      systemPrompt: PREMORTEM_SYSTEM_PROMPT,
      userPrompt: (s, ctx) =>
        `Assess what COULD kill ${s} from a FINANCIAL perspective.\n\nSearch evidence gathered:\n${ctx}\n\nAnalyze and return JSON.`,
    },
    subject,
    deep
  );
}
