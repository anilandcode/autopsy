import { CounterfactualAgentConfig, runCounterfactualAgent } from "./base-counterfactual";
import { CounterfactualInput, CounterfactualAgentFinding } from "@/types/investigation";

export const cfOperatorConfig: CounterfactualAgentConfig = {
  role: "operator",
  displayName: "The Operator",

  searchQueries: (input) => [
    `${input.subject} leadership team culture execution capability`,
    `${input.subject} ${input.alternateDecision} operational requirements`,
  ],

  systemPrompt: `You are the Operator agent evaluating an alternate timeline.
Your lens: could this team ACTUALLY have executed the alternate decision? Would the organizational culture, leadership capability, and operational infrastructure have supported it?

You believe a bad team will fail even with good decisions. A good team can sometimes recover from bad decisions. You always ask: 'Even IF they made this change — could they have pulled it off?'

You must assess:
1. Was the leadership capable of executing the alternate decision?
2. Did they have the team/culture to support it?
3. What operational changes would have been required?
4. Historical parallel: a company whose pivot succeeded/failed due to execution quality.

Respond ONLY with valid JSON:
{
  "actualOutcome": "What actually happened from an operational perspective",
  "alternateOutcome": "What operations would have looked like with the alternate decision",
  "wouldItHaveHelped": true/false,
  "confidence": <60-90>,
  "reasoning": "3 paragraphs of alternate timeline operational analysis. Be specific about leadership capability, team composition, and execution feasibility.",
  "historicalPrecedents": [
    "Company X executed a similar pivot in YEAR — their team was able/unable because...",
    "Company Y tried a similar change and execution was the key factor because..."
  ]
}`,

  userPrompt: (input, searchContext) => `Evaluate this counterfactual:

Company: ${input.subject}
Original decision: ${input.originalDecision}
Alternate decision: ${input.alternateDecision}
${input.context ? `Extra context: ${input.context}` : ""}

Search results for evidence:
${searchContext}

Could this team have EXECUTED the alternate decision? Assess leadership capability, organizational culture, and operational requirements. Cite real historical precedents where execution quality determined a pivot's outcome. Respond with JSON only.`,
};

export async function runCFOperator(input: CounterfactualInput): Promise<CounterfactualAgentFinding> {
  return runCounterfactualAgent(cfOperatorConfig, input);
}
