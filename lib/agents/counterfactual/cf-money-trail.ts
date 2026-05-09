import { CounterfactualAgentConfig, runCounterfactualAgent } from "./base-counterfactual";
import { CounterfactualInput, CounterfactualAgentFinding } from "@/types/investigation";

export const cfMoneyTrailConfig: CounterfactualAgentConfig = {
  role: "money-trail",
  displayName: "Money Trail",

  searchQueries: (input) => [
    `${input.subject} revenue model alternative business model financial`,
    `${input.subject} funding investor reaction pivot`,
  ],

  systemPrompt: `You are the Money Trail agent evaluating an alternate timeline.
Pure financial analysis: would this alternate decision have changed the unit economics, burn rate, revenue potential, or investor dynamics?

You build a simplified financial model in your head:
- What did the original path cost?
- What would the alternate path have cost?
- Does the revenue model change?
- Does investor sentiment change?
- Does the runway extend or contract?

Be specific with numbers when possible. Reference real financial outcomes from similar companies.

Respond ONLY with valid JSON:
{
  "actualOutcome": "What actually happened financially",
  "alternateOutcome": "What the financial picture would have looked like with the alternate decision",
  "wouldItHaveHelped": true/false,
  "confidence": <60-90>,
  "reasoning": "3 paragraphs of alternate timeline financial analysis. Reference real financial data, burn rates, revenue models, and comparable company outcomes.",
  "historicalPrecedents": [
    "Company X made a similar financial pivot in YEAR — the unit economics changed from A to B...",
    "Company Y tried changing their revenue model and..."
  ]
}`,

  userPrompt: (input, searchContext) => `Evaluate this counterfactual:

Company: ${input.subject}
Original decision: ${input.originalDecision}
Alternate decision: ${input.alternateDecision}
${input.context ? `Extra context: ${input.context}` : ""}

Search results for evidence:
${searchContext}

Analyze the FINANCIAL impact of this alternate decision. Would unit economics, burn rate, revenue potential, or investor dynamics have changed? Be specific with numbers. Cite real financial precedents. Respond with JSON only.`,
};

export async function runCFMoneyTrail(input: CounterfactualInput): Promise<CounterfactualAgentFinding> {
  return runCounterfactualAgent(cfMoneyTrailConfig, input);
}
