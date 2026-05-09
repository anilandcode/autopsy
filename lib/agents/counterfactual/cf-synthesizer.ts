import { complete } from "@/lib/llm";
import {
  CounterfactualInput,
  CounterfactualAgentFinding,
  CounterfactualReport,
  CounterfactualVerdict,
  AgentRole,
} from "@/types/investigation";

export async function runCounterfactualSynthesizer(
  input: CounterfactualInput,
  findings: CounterfactualAgentFinding[]
): Promise<CounterfactualReport> {
  const findingsJSON = JSON.stringify(
    findings.map((f) => ({
      role: f.role,
      displayName: f.displayName,
      status: f.status,
      actualOutcome: f.actualOutcome,
      alternateOutcome: f.alternateOutcome,
      wouldItHaveHelped: f.wouldItHaveHelped,
      confidenceInAlterate: f.confidenceInAlterate,
      reasoning: f.reasoning,
      historicalPrecedents: f.historicalPrecedents,
    })),
    null,
    2
  );

  const systemPrompt = `You are the Lead Investigator synthesizing a 6-agent counterfactual analysis. Your job: render a definitive verdict on the alternate timeline.

You must:
1. Count how many agents think the change would have helped
2. Weight their reasoning by quality of evidence (historical precedent beats speculation)
3. Identify the MOST SURPRISING insight from the debate
4. List butterfly effects — secondary consequences of the alternate decision that agents may have missed
5. Render a final verdict from these options:
   - would-have-survived
   - would-have-delayed-failure
   - would-have-failed-differently
   - would-have-made-no-difference
   - could-have-transformed-the-company

Assign survival probabilities:
- survivalProbabilityActual: what actually happened (usually 0 for failed companies)
- survivalProbabilityAlternate: with the change, 0-100

The delta between these is your headline number.

Be bold. Don't hedge. The whole point is a definitive alternate history verdict.

Respond ONLY with valid JSON:
{
  "verdict": "<one of the 5 verdict options>",
  "verdictLabel": "Human readable version",
  "survivalProbabilityActual": <0-100>,
  "survivalProbabilityAlternate": <0-100>,
  "probabilityDelta": <difference>,
  "executiveSummary": "2-3 sharp sentences summarizing the alternate timeline verdict",
  "keyInsight": "The single most surprising or counterintuitive finding from this analysis",
  "butterflyEffects": [
    "Secondary consequence 1 of the alternate decision",
    "Secondary consequence 2",
    "Secondary consequence 3"
  ],
  "historicalParallels": [
    "Company that made similar pivot + outcome",
    "Company 2"
  ],
  "agentsWhoThinkItHelps": [<list of agent roles who said yes>],
  "agentsWhoThinkItDoesntMatter": [<list who said no>]
}`;

  const userPrompt = `Synthesize this counterfactual analysis:

Company: ${input.subject}
Original decision: ${input.originalDecision}
Alternate decision: ${input.alternateDecision}
${input.context ? `Extra context: ${input.context}` : ""}

6-Agent Findings:
${findingsJSON}

Render a definitive verdict. Be bold, not hedging. Respond with JSON only.`;

  const raw = await complete(systemPrompt, userPrompt, {
    temperature: 0.7,
    maxTokens: 2000,
  });

  let parsed: Record<string, unknown> = {};
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
  } catch {
    parsed = {};
  }

  const actualProb = (parsed.survivalProbabilityActual as number) ?? 0;
  const alternateProb = (parsed.survivalProbabilityAlternate as number) ?? 0;
  const verdict = (parsed.verdict as CounterfactualVerdict) || "would-have-made-no-difference";

  const validVerdicts: CounterfactualVerdict[] = [
    "would-have-survived",
    "would-have-delayed-failure",
    "would-have-failed-differently",
    "would-have-made-no-difference",
    "could-have-transformed-the-company",
  ];

  const finalVerdict = validVerdicts.includes(verdict) ? verdict : "would-have-made-no-difference";

  return {
    subject: input.subject,
    originalDecision: input.originalDecision,
    alternateDecision: input.alternateDecision,
    verdict: finalVerdict,
    verdictLabel: (parsed.verdictLabel as string) || finalVerdict,
    survivalProbabilityActual: Math.min(100, Math.max(0, actualProb)),
    survivalProbabilityAlternate: Math.min(100, Math.max(0, alternateProb)),
    probabilityDelta: Math.min(100, Math.max(0, alternateProb - actualProb)),
    executiveSummary: (parsed.executiveSummary as string) || "",
    agentFindings: findings,
    agentsWhoThinkItHelps: (parsed.agentsWhoThinkItHelps as AgentRole[]) || findings.filter((f) => f.wouldItHaveHelped).map((f) => f.role),
    agentsWhoThinkItDoesntMatter: (parsed.agentsWhoThinkItDoesntMatter as AgentRole[]) || findings.filter((f) => !f.wouldItHaveHelped).map((f) => f.role),
    keyInsight: (parsed.keyInsight as string) || "",
    butterflyEffects: (parsed.butterflyEffects as string[]) || [],
    historicalParallels: (parsed.historicalParallels as string[]) || [],
    generatedAt: new Date().toISOString(),
  };
}
