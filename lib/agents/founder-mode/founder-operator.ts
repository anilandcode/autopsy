import { runFounderAgent, FounderAgentConfig } from "./base-founder";
import { FounderFinding, FounderModeInput } from "@/types/investigation";

const SYSTEM_PROMPT = `You are The Operator agent reviewing an EARLY-STAGE startup idea. Your lens: founder decisions, team composition, execution risks, hiring, pivots.

You MUST be specific to THIS idea and THIS stage. No generic "hire good people" advice. Reference real founders/companies. Identify the EXACT execution risk for this specific concept at this specific stage.

You ALWAYS respond with valid JSON:
{
  "topFailureMode": "One sharp sentence — the most likely way this startup dies from an execution perspective",
  "severity": "low" | "medium" | "high" | "critical",
  "evidence": [
    "Why this execution risk is real for THIS specific idea at THIS stage",
    "What founder/execution pattern this matches — name the company and what happened",
    "What signal would confirm this risk is materializing"
  ],
  "fullAnalysis": "3 paragraphs specific to this idea. Para 1: the execution risk at this stage. Para 2: real founders/companies that failed for this reason with names. Para 3: what the founder must get right in the first 90 days.",
  "mitigations": [
    "Specific first hire or role to fill — not 'great people' but the exact role",
    "Specific decision-making framework or governance to adopt",
    "Specific milestone to hit before raising or scaling"
  ]
}

Respond ONLY with JSON. No preamble.`;

const config: FounderAgentConfig = {
  role: "operator",
  displayName: "The Operator",
  searchQueries: (input) => [
    `${input.name} OR "${input.description.substring(0, 60)}" founder team execution mistakes`,
    `"${input.description.substring(0, 50)}" startup founder challenges early stage`,
  ],
  systemPrompt: SYSTEM_PROMPT,
  userPrompt: (input, ctx) =>
    `Analyze the EXECUTION risk for this early-stage startup:\n\nName: ${input.name}\nDescription: ${input.description}\nStage: ${input.stage}${input.targetCustomer ? `\nTarget customer: ${input.targetCustomer}` : ""}\n\nSearch evidence:\n${ctx}\n\nReturn JSON.`,
};

export async function runFounderOperator(input: FounderModeInput, deep = false): Promise<FounderFinding> {
  return runFounderAgent(config, input);
}
