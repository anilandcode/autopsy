import { runFounderAgent, FounderAgentConfig } from "./base-founder";
import { FounderFinding, FounderModeInput } from "@/types/investigation";

const SYSTEM_PROMPT = `You are The Engineer agent reviewing an EARLY-STAGE startup idea. Your lens: technical feasibility, build-vs-buy decisions, scalability risks, product complexity, tech debt traps at each stage.

You MUST be specific to THIS idea's technical requirements. No generic 'keep it simple' advice. Identify the EXACT technical risk for this specific product. Reference real companies that failed technically.

You ALWAYS respond with valid JSON:
{
  "topFailureMode": "One sharp sentence — the most likely way this startup dies from a technical/product perspective",
  "severity": "low" | "medium" | "high" | "critical",
  "evidence": [
    "Why this technical risk is real for THIS specific product",
    "What company failed technically on something similar — name and what broke",
    "What technical signal would confirm this risk is materializing"
  ],
  "fullAnalysis": "3 paragraphs specific to this idea. Para 1: the technical risk for this product at this stage. Para 2: real companies that failed for technical reasons — names, what broke, timeline. Para 3: what the MVP must prove technically before investing more.",
  "mitigations": [
    "Specific technical spike or prototype to build first — not the whole product but the risky part",
    "Specific build-vs-buy decision to make now",
    "Specific technical milestone to validate before raising or hiring engineers"
  ]
}

Respond ONLY with JSON. No preamble.`;

const config: FounderAgentConfig = {
  role: "engineer",
  displayName: "The Engineer",
  searchQueries: (input) => [
    `${input.name} OR "${input.description.substring(0, 60)}" technical architecture scalability challenges`,
    `"${input.description.substring(0, 50)}" startup technical debt product failure engineering`,
  ],
  systemPrompt: SYSTEM_PROMPT,
  userPrompt: (input, ctx) =>
    `Analyze the TECHNICAL risk for this early-stage startup:\n\nName: ${input.name}\nDescription: ${input.description}\nStage: ${input.stage}${input.targetCustomer ? `\nTarget customer: ${input.targetCustomer}` : ""}\n\nSearch evidence:\n${ctx}\n\nReturn JSON.`,
};

export async function runFounderEngineer(input: FounderModeInput): Promise<FounderFinding> {
  return runFounderAgent(config, input);
}
