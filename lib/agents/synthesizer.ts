import { complete, extractJSON } from "@/lib/llm";
import { AgentFinding, AgentRole, AgentDebateOutput, ConsequentialDisagreement, Disagreement, PostmortemReport } from "@/types/investigation";

const SYSTEM_PROMPT = `You are the Lead Investigator synthesizing a 6-agent postmortem.
Your job: find truth by weighing evidence, not averaging opinions.
If 5 agents agree and 1 disagrees with strong evidence, the 1 might be right.
Always identify the real primary cause of death — the ROOT cause, not symptoms.

You have 6 agent findings AND a debate round where agents explicitly disagreed.
Use the disagreements to find truth — the dissenting agent might be onto something the majority missed.
Identify which debate point is most consequential.

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
  "mostConsequentialDisagreement": {
    "agentA": "role",
    "agentB": "role",
    "topic": "the debate point that matters most",
    "whoseRightAndWhy": "One sharp sentence: [agent] is right because..."
  },
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
  findings: AgentFinding[],
  debateOutputs: AgentDebateOutput[] = []
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

  const debateSection = debateOutputs.length > 0
    ? `\n\nHere is the DEBATE ROUND — agents explicitly critiqued each other:\n${JSON.stringify(debateOutputs, null, 2)}\n\nUse these disagreements to sharpen your synthesis. The dissenting agent may be right.`
    : "";

  const userPrompt = `Investigate: ${subject}

Here are the findings from all 6 specialist agents:

${findingsJson}
${debateSection}

Synthesize these into a final verdict. Return JSON.`;

  const rawOutput = await complete(SYSTEM_PROMPT, userPrompt, {
    temperature: 0.5,
    maxTokens: 2500,
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
  // Normalize to 0-1 scale for the UI
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
