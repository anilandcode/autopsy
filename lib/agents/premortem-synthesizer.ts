import { complete, extractJSON } from "@/lib/llm";
import { PremortemFinding, PremortemReport } from "@/types/investigation";

const SYSTEM_PROMPT = `You are the Lead Investigator synthesizing a 6-agent PRE-MORTEM risk analysis.
Your job: identify the greatest threats to this company's survival by weighing evidence from all agents.
The most concerning finding should dominate, even if only 1 agent flagged it.
Always identify the single biggest threat — the ROOT risk, not symptoms.

Respond ONLY with valid JSON in this exact format:
{
  "overallRiskScore": <number 0-100, where 100 means near-certain failure>,
  "topThreatToSurvival": "One sentence: the single greatest threat to this company's survival",
  "riskCategories": "Which agent's finding is most concerning and why (1-2 sentences)",
  "earlyWarningSystem": [
    "Specific signal 1 to monitor — precise and measurable",
    "Specific signal 2 to monitor",
    "Specific signal 3 to monitor",
    "Specific signal 4 to monitor",
    "Specific signal 5 to monitor",
    "Specific signal 6 to monitor",
    "Specific signal 7 to monitor",
    "Specific signal 8 to monitor",
    "Specific signal 9 to monitor",
    "Specific signal 10 to monitor"
  ],
  "defensiveActions": [
    "Specific action 1 the company should take now to reduce risk",
    "Specific action 2",
    "Specific action 3",
    "Specific action 4",
    "Specific action 5"
  ]
}

Respond ONLY with the JSON object. No preamble, no explanation outside JSON.`;

export async function runPremortemSynthesizer(
  subject: string,
  findings: PremortemFinding[]
): Promise<PremortemReport> {
  const findingsJson = JSON.stringify(
    findings.map((f) => ({
      role: f.role,
      displayName: f.displayName,
      topRisk: f.topRisk,
      riskLevel: f.riskLevel,
      evidence: f.evidence,
      earlyWarnings: f.earlyWarnings,
      fullAnalysis: f.fullAnalysis,
    })),
    null,
    2
  );

  const userPrompt = `Pre-Mortem Analysis: ${subject}

Here are the risk findings from all 6 specialist agents:

${findingsJson}

Synthesize these into a final pre-mortem risk assessment. Return JSON.`;

  const rawOutput = await complete(SYSTEM_PROMPT, userPrompt, {
    temperature: 0.5,
    maxTokens: 2000,
  });

  let parsed: Record<string, unknown> = {};
  try {
    const cleanJSON = extractJSON(rawOutput);
    parsed = JSON.parse(cleanJSON);
  } catch {
    console.error("[premortem-synthesizer] JSON parse failed:", rawOutput.slice(0, 200));
    parsed = {};
  }

  const rawScore = (parsed.overallRiskScore as number) ?? 50;
  const overallRiskScore = Math.min(100, Math.max(0, rawScore));

  return {
    subject,
    overallRiskScore,
    topThreatToSurvival:
      (parsed.topThreatToSurvival as string) || "Risk assessment incomplete",
    riskCategories:
      (parsed.riskCategories as string) || "Analysis pending",
    earlyWarningSystem: Array.isArray(parsed.earlyWarningSystem)
      ? (parsed.earlyWarningSystem as string[]).slice(0, 10)
      : [],
    defensiveActions: Array.isArray(parsed.defensiveActions)
      ? (parsed.defensiveActions as string[]).slice(0, 5)
      : [],
    agentFindings: findings,
    generatedAt: new Date().toISOString(),
  };
}
