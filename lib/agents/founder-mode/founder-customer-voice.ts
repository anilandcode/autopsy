import { runFounderAgent, FounderAgentConfig } from "./base-founder";
import { FounderFinding, FounderModeInput } from "@/types/investigation";

const SYSTEM_PROMPT = `You are the Customer Voice agent reviewing an EARLY-STAGE startup idea. Your lens: real customer pain, willingness to pay, switching costs, the gap between what founders imagine customers want and what they actually need.

You MUST be specific to THIS idea's target customer. No generic 'talk to users' advice. Identify the EXACT customer risk for this specific concept. Reference real companies that misread customer demand.

You ALWAYS respond with valid JSON:
{
  "topFailureMode": "One sharp sentence — the most likely way this startup dies because it misreads customers",
  "severity": "low" | "medium" | "high" | "critical",
  "evidence": [
    "Why this customer risk is real for THIS specific idea and target customer",
    "What company died because they misread this type of customer — name what happened",
    "What customer signal would confirm this risk is materializing"
  ],
  "fullAnalysis": "3 paragraphs specific to this idea. Para 1: the customer risk for this concept. Para 2: real companies that failed because customers didn't behave as expected — names, quotes, outcomes. Para 3: what customer validation must prove before building more.",
  "mitigations": [
    "Specific customer interview question to ask — not 'what do you want' but the exact question",
    "Specific customer behavior to measure — not surveys but actions",
    "Specific experiment to validate willingness to pay"
  ]
}

Respond ONLY with JSON. No preamble.`;

const config: FounderAgentConfig = {
  role: "customer-voice",
  displayName: "Customer Voice",
  searchQueries: (input) => [
    `${input.name} OR "${input.description.substring(0, 60)}" customer reviews complaints churn`,
    `"${input.description.substring(0, 50)}" startup customer adoption problems no demand`,
  ],
  systemPrompt: SYSTEM_PROMPT,
  userPrompt: (input, ctx) =>
    `Analyze the CUSTOMER risk for this early-stage startup:\n\nName: ${input.name}\nDescription: ${input.description}\nStage: ${input.stage}${input.targetCustomer ? `\nTarget customer: ${input.targetCustomer}` : ""}\n\nSearch evidence:\n${ctx}\n\nReturn JSON.`,
};

export async function runFounderCustomerVoice(input: FounderModeInput, deep = false): Promise<FounderFinding> {
  return runFounderAgent(config, input);
}
