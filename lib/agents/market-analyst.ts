import { runAgent } from "./base";
import { AgentFinding } from "@/types/investigation";

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

export async function runMarketAnalyst(
  subject: string
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
    subject
  );
}
