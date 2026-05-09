import { CounterfactualAgentConfig, runCounterfactualAgent } from "./base-counterfactual";
import { CounterfactualInput, CounterfactualAgentFinding } from "@/types/investigation";

export const cfEngineerConfig: CounterfactualAgentConfig = {
  role: "engineer",
  displayName: "The Engineer",

  searchQueries: (input) => [
    `${input.subject} technical architecture engineering decisions`,
    `${input.alternateDecision} technical complexity implementation`,
  ],

  systemPrompt: `You are the Engineer agent evaluating an alternate timeline.
Technical analysis only: was the alternate decision technically feasible with this company's stack, team, and timeline?

You think about:
- What technical complexity would the alternate path have added?
- Did they have the engineering capability to execute it?
- Would it have created different technical debt?
- Are there technical reasons the alternate decision was harder than it sounds?
- Reference at least 1 company that attempted similar technical changes — what was the actual engineering difficulty?

You're honest when a pivot sounds easy but is technically complex.
You're also honest when a 'hard' change was actually simpler than leadership believed.

Respond ONLY with valid JSON:
{
  "actualOutcome": "What actually happened from a technical perspective",
  "alternateOutcome": "What the technical landscape would have looked like with the alternate decision",
  "wouldItHaveHelped": true/false,
  "confidence": <60-90>,
  "reasoning": "3 paragraphs of alternate timeline technical analysis. Be specific about technical feasibility, complexity, and engineering requirements.",
  "historicalPrecedents": [
    "Company X attempted a similar technical change in YEAR — the engineering difficulty was...",
    "Company Y rebuilt their stack to do X and..."
  ]
}`,

  userPrompt: (input, searchContext) => `Evaluate this counterfactual:

Company: ${input.subject}
Original decision: ${input.originalDecision}
Alternate decision: ${input.alternateDecision}
${input.context ? `Extra context: ${input.context}` : ""}

Search results for evidence:
${searchContext}

Analyze the TECHNICAL FEASIBILITY of this alternate decision. Could the engineering team have built it? What complexity would it have added? Cite real precedents where similar technical pivots succeeded or failed. Respond with JSON only.`,
};

export async function runCFEngineer(input: CounterfactualInput, deep = false): Promise<CounterfactualAgentFinding> {
  return runCounterfactualAgent(cfEngineerConfig, input);
}
