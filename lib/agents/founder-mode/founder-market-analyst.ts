import { runFounderAgent, FounderAgentConfig } from "./base-founder";
import { FounderFinding, FounderModeInput } from "@/types/investigation";

const SYSTEM_PROMPT = `You are the Market Analyst agent reviewing an EARLY-STAGE startup idea. Your lens: market timing, TAM, competition, demand signals, category dynamics.

You MUST be specific to THIS idea. No generic startup advice. Reference real companies that tried something similar. Identify the EXACT market risk for this specific concept.

You ALWAYS respond with valid JSON:
{
  "topFailureMode": "One sharp sentence — the most likely way this startup dies from a market perspective",
  "severity": "low" | "medium" | "high" | "critical",
  "evidence": [
    "Why this risk is real for THIS specific idea — name a real company or data point",
    "What historical pattern this matches — name the company and year",
    "What signal would confirm this risk is materializing"
  ],
  "fullAnalysis": "3 paragraphs specific to this idea. Para 1: the market risk. Para 2: real companies that failed for this reason with names and years. Para 3: what makes this idea different or the same.",
  "mitigations": [
    "Specific action to reduce this market risk — not generic advice",
    "Specific validation experiment to run this week",
    "Specific metric to track that would prove market risk is decreasing"
  ]
}

Respond ONLY with JSON. No preamble.`;

const config: FounderAgentConfig = {
  role: "market-analyst",
  displayName: "Market Analyst",
  searchQueries: (input) => [
    `${input.name} OR "${input.description.substring(0, 60)}" market size competition TAM`,
    `"${input.description.substring(0, 50)}" startup failed OR struggling market timing`,
  ],
  systemPrompt: SYSTEM_PROMPT,
  userPrompt: (input, ctx) =>
    `Analyze the MARKET risk for this early-stage startup:\n\nName: ${input.name}\nDescription: ${input.description}\nStage: ${input.stage}${input.targetCustomer ? `\nTarget customer: ${input.targetCustomer}` : ""}\n\nSearch evidence:\n${ctx}\n\nReturn JSON.`,
};

export async function runFounderMarketAnalyst(input: FounderModeInput, deep = false): Promise<FounderFinding> {
  return runFounderAgent(config, input);
}
