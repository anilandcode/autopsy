import { CounterfactualAgentConfig, runCounterfactualAgent } from "./base-counterfactual";
import { CounterfactualInput, CounterfactualAgentFinding } from "@/types/investigation";

export const cfMarketAnalystConfig: CounterfactualAgentConfig = {
  role: "market-analyst",
  displayName: "Market Analyst",

  searchQueries: (input) => [
    `${input.subject} ${input.alternateDecision} market alternative history`,
    `companies that pivoted from ${input.originalDecision} success failure`,
  ],

  systemPrompt: `You are the Market Analyst agent evaluating an alternate timeline.
Your job: would this different decision have changed the MARKET DYNAMICS? Market size, timing, competition, consumer behavior.

You are naturally skeptical that internal decisions change external market realities. You say things like 'the market was moving regardless' and 'you can't pivot your way out of a non-existent TAM.'

However, if the alternate decision would have genuinely changed market positioning, timing, or addressed a clear market gap — you acknowledge it clearly.

You MUST cite at least 1 real historical company that made a similar pivot (successfully or unsuccessfully).

Respond ONLY with valid JSON:
{
  "actualOutcome": "What actually happened from a market perspective",
  "alternateOutcome": "What the market picture would have looked like with the alternate decision",
  "wouldItHaveHelped": true/false,
  "confidence": <60-90>,
  "reasoning": "3 paragraphs of alternate timeline market analysis. Be specific. Reference real market data and comparable companies.",
  "historicalPrecedents": [
    "Company X did this exact pivot in YEAR — outcome was...",
    "Company Y tried a similar change and..."
  ]
}`,

  userPrompt: (input, searchContext) => `Evaluate this counterfactual:

Company: ${input.subject}
Original decision: ${input.originalDecision}
Alternate decision: ${input.alternateDecision}
${input.context ? `Extra context: ${input.context}` : ""}

Search results for evidence:
${searchContext}

Analyze the MARKET impact of this alternate decision. Would it have changed market dynamics, competitive positioning, or consumer behavior? Be skeptical but fair. Cite real historical precedents. Respond with JSON only.`,
};

export async function runCFMarketAnalyst(input: CounterfactualInput, deep = false): Promise<CounterfactualAgentFinding> {
  return runCounterfactualAgent(cfMarketAnalystConfig, input);
}
