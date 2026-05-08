import { complete } from "@/lib/llm";
import { FounderFinding, FounderReport, FounderModeInput } from "@/types/investigation";
import { FAILURE_DATABASE, findSimilarFailures } from "@/lib/failure-database";

const SYSTEM_PROMPT = `You are the Lead Investigator synthesizing a 6-agent FOUNDER MODE analysis of an early-stage startup idea.
Your job: identify the most critical failure modes, the genuine green flags, and produce actionable homework — not platitudes.

Be BRUTALLY SPECIFIC. Every point must reference the specific idea, not generic startup advice.
Every "homework" item must be something the founder can validate THIS WEEK with a concrete action.

Respond ONLY with valid JSON:
{
  "viabilityScore": <0-100, where 100 = this idea will almost certainly succeed, 0 = dead on arrival>,
  "topFailureModes": [
    "The #1 most likely way this dies — specific to this idea",
    "The #2 failure mode — specific to this idea",
    "The #3 failure mode — specific to this idea"
  ],
  "redFlags": [
    "Specific concerning pattern 1 — name the precedent company",
    "Specific concerning pattern 2",
    "Specific concerning pattern 3",
    "Specific concerning pattern 4",
    "Specific concerning pattern 5"
  ],
  "greenFlags": [
    "Specific encouraging signal 1 — why this idea might work",
    "Specific encouraging signal 2",
    "Specific encouraging signal 3",
    "Specific encouraging signal 4",
    "Specific encouraging signal 5"
  ],
  "criticalDecisions": [
    "Decision 1 the founder MUST get right — what to decide and how",
    "Decision 2",
    "Decision 3",
    "Decision 4",
    "Decision 5"
  ],
  "founderHomework": [
    "Specific action 1 to validate THIS WEEK — e.g., 'Call 5 [specific type] of customer and ask [specific question]'",
    "Specific action 2",
    "Specific action 3",
    "Specific action 4",
    "Specific action 5",
    "Specific action 6",
    "Specific action 7",
    "Specific action 8",
    "Specific action 9",
    "Specific action 10"
  ],
  "similarSuccesses": [
    "Company name that did something similar and succeeded — and what they did right",
    "Company name 2"
  ],
  "similarFailures": [
    "Company name that tried something similar and failed — and what killed them",
    "Company name 2"
  ]
}

Respond ONLY with the JSON object. No preamble, no explanation outside JSON.`;

export async function runFounderSynthesizer(
  input: FounderModeInput,
  findings: FounderFinding[]
): Promise<FounderReport> {
  const findingsJson = JSON.stringify(
    findings.map((f) => ({
      role: f.role,
      displayName: f.displayName,
      topFailureMode: f.topFailureMode,
      severity: f.severity,
      evidence: f.evidence,
      mitigations: f.mitigations,
      fullAnalysis: f.fullAnalysis,
    })),
    null,
    2
  );

  const userPrompt = `Founder Mode Analysis: ${input.name}

Idea: ${input.description}
Stage: ${input.stage}${input.targetCustomer ? `\nTarget customer: ${input.targetCustomer}` : ""}

Here are the findings from all 6 specialist agents:

${findingsJson}

Synthesize these into a founder mode report. Be specific to this idea, not generic. Return JSON.`;

  const rawOutput = await complete(SYSTEM_PROMPT, userPrompt, {
    temperature: 0.5,
    maxTokens: 2500,
  });

  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    parsed = {};
  }

  const rawScore = (parsed.viabilityScore as number) ?? 50;
  const viabilityScore = Math.min(100, Math.max(0, rawScore));

  // Pull similar companies from failure database
  const descTags = input.description.toLowerCase().split(/\s+/).filter((w) => w.length > 4).slice(0, 5);
  const archetype = input.stage === "Pre-launch" ? "no-pmf" : input.stage === "Scaling" ? "burn-rate" : "execution";
  const similar = findSimilarFailures(archetype, descTags);

  return {
    ideaName: input.name,
    viabilityScore,
    topFailureModes: Array.isArray(parsed.topFailureModes)
      ? (parsed.topFailureModes as string[]).slice(0, 3)
      : [],
    redFlags: Array.isArray(parsed.redFlags)
      ? (parsed.redFlags as string[]).slice(0, 5)
      : [],
    greenFlags: Array.isArray(parsed.greenFlags)
      ? (parsed.greenFlags as string[]).slice(0, 5)
      : [],
    criticalDecisions: Array.isArray(parsed.criticalDecisions)
      ? (parsed.criticalDecisions as string[]).slice(0, 5)
      : [],
    founderHomework: Array.isArray(parsed.founderHomework)
      ? (parsed.founderHomework as string[]).slice(0, 10)
      : [],
    similarSuccesses: Array.isArray(parsed.similarSuccesses)
      ? (parsed.similarSuccesses as string[]).slice(0, 3)
      : [],
    similarFailures: Array.isArray(parsed.similarFailures)
      ? (parsed.similarFailures as string[]).slice(0, 3)
      : similar.map((c) => `${c.name} (${c.yearDied}): ${c.oneLiner}`),
    agentFindings: findings,
    generatedAt: new Date().toISOString(),
  };
}
