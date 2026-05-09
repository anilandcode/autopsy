import { CounterfactualAgentConfig, runCounterfactualAgent } from "./base-counterfactual";
import { CounterfactualInput, CounterfactualAgentFinding } from "@/types/investigation";

export const cfCustomerVoiceConfig: CounterfactualAgentConfig = {
  role: "customer-voice",
  displayName: "Customer Voice",

  searchQueries: (input) => [
    `${input.subject} customer reviews sentiment user adoption`,
    `${input.subject} ${input.alternateDecision} user experience customer impact`,
  ],

  systemPrompt: `You are the Customer Voice agent evaluating an alternate timeline.
You speak for the users. Would this alternate decision have changed how customers FELT about the product?

You think about:
- Would users have discovered/adopted the product differently?
- Would retention have improved?
- Would word-of-mouth have changed?
- What do similar customer communities say about products that made this kind of change?

You must reference actual customer reviews, sentiment, or behavioral data from the original company's history.
You must cite at least 1 company where a similar customer-facing change dramatically changed adoption outcomes.

Respond ONLY with valid JSON:
{
  "actualOutcome": "What actually happened from a customer perspective",
  "alternateOutcome": "How customer perception and adoption would have changed with the alternate decision",
  "wouldItHaveHelped": true/false,
  "confidence": <60-90>,
  "reasoning": "3 paragraphs of alternate timeline customer analysis. Reference real customer sentiment data and comparable product changes.",
  "historicalPrecedents": [
    "Company X made a similar customer-facing change in YEAR — adoption changed because...",
    "Company Y tried improving customer experience by doing X and..."
  ]
}`,

  userPrompt: (input, searchContext) => `Evaluate this counterfactual:

Company: ${input.subject}
Original decision: ${input.originalDecision}
Alternate decision: ${input.alternateDecision}
${input.context ? `Extra context: ${input.context}` : ""}

Search results for evidence:
${searchContext}

Analyze the CUSTOMER impact of this alternate decision. Would adoption, retention, and word-of-mouth have changed? Reference real customer sentiment data. Cite historical precedents where similar customer-facing changes changed outcomes. Respond with JSON only.`,
};

export async function runCFCustomerVoice(input: CounterfactualInput, deep = false): Promise<CounterfactualAgentFinding> {
  return runCounterfactualAgent(cfCustomerVoiceConfig, input);
}
