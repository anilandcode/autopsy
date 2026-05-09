import { complete, extractJSON } from "@/lib/llm";
import { AgentFinding, AgentRole, AgentDebateOutput, ConsequentialDisagreement, Disagreement, PostmortemReport } from "@/types/investigation";

const SYSTEM_PROMPT = `You are the Lead Investigator.
Read the 6 agent findings and write a final verdict.
Return ONLY valid JSON, absolutely no other text:
{
  "executiveSummary": "2-3 sentences. Sharp. Opinionated. No hedging.",
  "primaryCauseOfDeath": "One root cause sentence.",
  "confidenceScore": <70-95>,
  "whatWouldHaveSavedIt": ["action 1", "action 2", "action 3"],
  "lessonsForBuilders": ["lesson 1", "lesson 2", "lesson 3", "lesson 4"],
  "disagreements": [
    {
      "agentA": "market-analyst",
      "agentB": "operator",
      "topic": "topic of disagreement",
      "agentAPosition": "what market-analyst argues",
      "agentBPosition": "what operator argues"
    }
  ],
  "mostConsequentialDisagreement": {
    "agentA": "role",
    "agentB": "role",
    "topic": "topic",
    "whoseRightAndWhy": "explanation"
  }
}`;

export async function runSynthesizer(
  subject: string,
  findings: AgentFinding[],
  debateOutputs: AgentDebateOutput[] = []
): Promise<PostmortemReport> {
  const debateSection = debateOutputs.length > 0
    ? `\nDebate: ${JSON.stringify(debateOutputs.map(d => ({ agent: d.agentRole, disagreesWith: d.disagreesWith, reason: d.disagreementReason, agreesWith: d.agreesWith, agreeReason: d.agreementReason })))}`
    : "";

  const userPrompt = `Company: ${subject}
Agent findings summary:
${findings.map(f =>
  `${f.role}: ${f.primaryCause} (confidence: ${f.confidence})`
).join('\n')}

Full findings JSON:
${JSON.stringify(findings.map(f => ({
  role: f.role,
  primaryCause: f.primaryCause,
  confidence: f.confidence,
  evidence: f.evidence.slice(0, 2)
})))}${debateSection}

Return verdict JSON only.`;

  const rawOutput = await complete(SYSTEM_PROMPT, userPrompt, {
    temperature: 0.5,
    maxTokens: 1200,
  });

  let parsed: Record<string, unknown> = {};
  try {
    const cleanJSON = extractJSON(rawOutput);
    parsed = JSON.parse(cleanJSON);
  } catch {
    console.error("[synthesizer] JSON parse failed:", rawOutput.slice(0, 200));
    parsed = {};
  }

  const rawConfidence = (parsed.confidenceScore as number) || 75;
  const confidenceScore = rawConfidence > 1 ? rawConfidence / 100 : rawConfidence;

  const disagreements: Disagreement[] = Array.isArray(parsed.disagreements)
    ? (parsed.disagreements as Disagreement[])
    : [];

  let mostConsequentialDisagreement: ConsequentialDisagreement | null = null;
  if (parsed.mostConsequentialDisagreement && typeof parsed.mostConsequentialDisagreement === "object") {
    const mcd = parsed.mostConsequentialDisagreement as Record<string, unknown>;
    if (mcd.agentA && mcd.agentB && mcd.topic) {
      mostConsequentialDisagreement = {
        agentA: mcd.agentA as AgentRole,
        agentB: mcd.agentB as AgentRole,
        topic: mcd.topic as string,
        whoseRightAndWhy: (mcd.whoseRightAndWhy as string) || "",
      };
    }
  }

  return {
    subject,
    executiveSummary: (parsed.executiveSummary as string) || rawOutput,
    primaryCauseOfDeath:
      (parsed.primaryCauseOfDeath as string) || "Synthesis incomplete",
    confidenceScore: Math.min(1, Math.max(0, confidenceScore)),
    agentFindings: findings,
    disagreements,
    debateRound: debateOutputs,
    mostConsequentialDisagreement,
    whatWouldHaveSavedIt: Array.isArray(parsed.whatWouldHaveSavedIt)
      ? (parsed.whatWouldHaveSavedIt as string[])
      : [],
    lessonsForBuilders: Array.isArray(parsed.lessonsForBuilders)
      ? (parsed.lessonsForBuilders as string[])
      : [],
    generatedAt: new Date().toISOString(),
  };
}
