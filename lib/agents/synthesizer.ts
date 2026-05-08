import { complete } from "@/lib/llm";
import { AgentFinding, Disagreement, PostmortemReport } from "@/types/investigation";

const SYSTEM_PROMPT = `You are the Lead Investigator synthesizing a 6-agent postmortem.
Your job: find truth by weighing evidence, not averaging opinions.
If 5 agents agree and 1 disagrees with strong evidence, the 1 might be right.
Always identify the real primary cause of death — the ROOT cause, not symptoms.

Respond ONLY with valid JSON in this exact format:
{
  "executiveSummary": "2-3 sentence sharp summary of why it truly failed",
  "primaryCauseOfDeath": "The single root cause in one sentence",
  "confidenceScore": <70-95>,
  "disagreements": [
    {
      "agentA": "market-analyst",
      "agentB": "operator",
      "topic": "what they disagree on",
      "agentAPosition": "what market-analyst says",
      "agentBPosition": "what operator says"
    }
  ],
  "whatWouldHaveSavedIt": [
    "Specific actionable thing 1",
    "Specific actionable thing 2",
    "Specific actionable thing 3"
  ],
  "lessonsForBuilders": [
    "Lesson 1 — applicable to any founder",
    "Lesson 2",
    "Lesson 3",
    "Lesson 4"
  ]
}

Respond ONLY with the JSON object. No preamble, no explanation outside JSON.`;

export async function runSynthesizer(
  subject: string,
  findings: AgentFinding[]
): Promise<PostmortemReport> {
  const findingsJson = JSON.stringify(
    findings.map((f) => ({
      role: f.role,
      displayName: f.displayName,
      primaryCause: f.primaryCause,
      confidence: f.confidence,
      evidence: f.evidence,
      fullAnalysis: f.fullAnalysis,
    })),
    null,
    2
  );

  const userPrompt = `Investigate: ${subject}

Here are the findings from all 6 specialist agents:

${findingsJson}

Synthesize these into a final verdict. Return JSON.`;

  const rawOutput = await complete(SYSTEM_PROMPT, userPrompt, {
    temperature: 0.5,
    maxTokens: 2000,
  });

  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    parsed = {};
  }

  const rawConfidence = (parsed.confidenceScore as number) || 75;
  // Normalize to 0-1 scale for the UI
  const confidenceScore = rawConfidence > 1 ? rawConfidence / 100 : rawConfidence;

  const disagreements: Disagreement[] = Array.isArray(parsed.disagreements)
    ? (parsed.disagreements as Disagreement[])
    : [];

  return {
    subject,
    executiveSummary: (parsed.executiveSummary as string) || rawOutput,
    primaryCauseOfDeath:
      (parsed.primaryCauseOfDeath as string) || "Synthesis incomplete",
    confidenceScore: Math.min(1, Math.max(0, confidenceScore)),
    agentFindings: findings,
    disagreements,
    whatWouldHaveSavedIt: Array.isArray(parsed.whatWouldHaveSavedIt)
      ? (parsed.whatWouldHaveSavedIt as string[])
      : [],
    lessonsForBuilders: Array.isArray(parsed.lessonsForBuilders)
      ? (parsed.lessonsForBuilders as string[])
      : [],
    generatedAt: new Date().toISOString(),
  };
}
