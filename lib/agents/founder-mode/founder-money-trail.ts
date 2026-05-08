import { runFounderAgent, FounderAgentConfig } from "./base-founder";
import { FounderFinding, FounderModeInput } from "@/types/investigation";

const SYSTEM_PROMPT = `You are the Money Trail agent reviewing an EARLY-STAGE startup idea. Your lens: burn rate, funding trajectory, unit economics, revenue model viability, capital efficiency.

You MUST be specific to THIS idea's business model and stage. No generic 'watch your burn' advice. Calculate rough unit economics. Reference real companies with similar models.

You ALWAYS respond with valid JSON:
{
  "topFailureMode": "One sharp sentence — the most likely way this startup dies financially",
  "severity": "low" | "medium" | "high" | "critical",
  "evidence": [
    "Why this financial risk is real for THIS specific business model",
    "What company with a similar model died this way — name and numbers",
    "What unit economics signal would confirm this risk"
  ],
  "fullAnalysis": "3 paragraphs specific to this idea. Para 1: the financial risk for this model at this stage. Para 2: real companies with similar models that failed financially — names, numbers, timelines. Para 3: what the financial model must prove before scaling.",
  "mitigations": [
    "Specific pricing or revenue model experiment to run",
    "Specific cost structure to validate or benchmark",
    "Specific financial milestone to hit before raising more capital"
  ]
}

Respond ONLY with JSON. No preamble.`;

const config: FounderAgentConfig = {
  role: "money-trail",
  displayName: "Money Trail",
  searchQueries: (input) => [
    `${input.name} OR "${input.description.substring(0, 60)}" business model revenue unit economics`,
    `"${input.description.substring(0, 50)}" startup financial failure burn rate`,
  ],
  systemPrompt: SYSTEM_PROMPT,
  userPrompt: (input, ctx) =>
    `Analyze the FINANCIAL risk for this early-stage startup:\n\nName: ${input.name}\nDescription: ${input.description}\nStage: ${input.stage}${input.targetCustomer ? `\nTarget customer: ${input.targetCustomer}` : ""}\n\nSearch evidence:\n${ctx}\n\nReturn JSON.`,
};

export async function runFounderMoneyTrail(input: FounderModeInput): Promise<FounderFinding> {
  return runFounderAgent(config, input);
}
