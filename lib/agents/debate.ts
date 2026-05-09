import { complete, extractJSON } from "@/lib/llm";
import { AgentFinding, AgentRole, AgentDebateOutput } from "@/types/investigation";

const DEBATE_SYSTEM_PROMPT = `You are a specialist agent reviewing the findings of 5 other AI investigators.
You have your own initial finding. Now you must critically engage with the others.

Be SPECIFIC and HONEST. Reference the other agent's actual analysis, not generic observations.

You MUST populate both disagreementReason and agreementReason with specific, substantive text.
NEVER leave them empty or say "not specified".
These must be real opinions based on the findings provided.

Respond ONLY with valid JSON:
{
  "disagreesWith": "<agent role you most disagree with>",
  "disagreementReason": "One sharp sentence: I most disagree with [agent] because...",
  "agreesWith": "<agent role you find most convincing>",
  "agreementReason": "One sharp sentence: I find [agent]'s analysis strongest because..."
}

The agent roles are: market-analyst, operator, money-trail, customer-voice, engineer, historian.
Respond ONLY with the JSON object.`;

async function runAgentDebate(
  ownFinding: AgentFinding,
  otherFindings: AgentFinding[]
): Promise<AgentDebateOutput> {
  const othersSummary = otherFindings
    .map((f) => `[${f.role}] ${f.displayName}: "${f.primaryCause}" — ${f.fullAnalysis.slice(0, 200)}`)
    .join("\n\n");

  const userPrompt = `Your finding:\n[${ownFinding.role}] ${ownFinding.displayName}: "${ownFinding.primaryCause}"\n\nOther agents' findings:\n${othersSummary}\n\nNow: which agent do you most disagree with and why? Which do you find most convincing? Return JSON.`;

  const rawOutput = await complete(DEBATE_SYSTEM_PROMPT, userPrompt, {
    temperature: 0.6,
    maxTokens: 500,
  });

  let parsed: Record<string, unknown> = {};
  try {
    const cleanJSON = extractJSON(rawOutput);
    parsed = JSON.parse(cleanJSON);
  } catch {
    parsed = {};
  }

  return {
    agentRole: ownFinding.role,
    disagreesWith: (parsed.disagreesWith as AgentRole) || otherFindings[0]?.role || "market-analyst",
    disagreementReason: (parsed.disagreementReason as string) || "",
    agreesWith: (parsed.agreesWith as AgentRole) || otherFindings[0]?.role || "market-analyst",
    agreementReason: (parsed.agreementReason as string) || "",
  };
}

export async function runDebateRound(
  findings: AgentFinding[]
): Promise<AgentDebateOutput[]> {
  const doneFindings = findings.filter((f) => f.status === "done");
  if (doneFindings.length < 2) return [];

  const results = await Promise.all(
    doneFindings.map((finding) => {
      const others = doneFindings.filter((f) => f.role !== finding.role);
      return runAgentDebate(finding, others);
    })
  );

  return results;
}
