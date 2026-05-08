import { runFounderAgent, FounderAgentConfig } from "./base-founder";
import { FounderFinding, FounderModeInput } from "@/types/investigation";
import { findSimilarFailures, FAILURE_DATABASE } from "@/lib/failure-database";

const SYSTEM_PROMPT = `You are the Historian agent reviewing an EARLY-STAGE startup idea. You pattern-match this idea against historical failures and successes. You have access to a database of 30 famous startup failures. Similar cases are provided in the prompt.

You MUST reference specific companies BY NAME AND YEAR. Identify which historical archetype this idea is most vulnerable to. Give specific historical parallels, not generic patterns.

You ALWAYS respond with valid JSON:
{
  "topFailureMode": "One sharp sentence — the historical pattern most likely to kill this startup",
  "severity": "low" | "medium" | "high" | "critical",
  "evidence": [
    "Why this historical pattern applies to THIS specific idea — name the parallel company",
    "What company died this way — name, year, what happened",
    "What early signal would confirm this pattern is repeating"
  ],
  "fullAnalysis": "3 paragraphs specific to this idea. Para 1: which historical archetype this idea is most vulnerable to. Para 2: specific companies from the database that died this way — names, years, the warning signs. Para 3: what this founder must do differently to avoid becoming the next case study.",
  "mitigations": [
    "Specific action to avoid repeating the historical failure — name the company they should study",
    "Specific validation to prove this idea is different from the failed precedent",
    "Specific checkpoint where the founder should pivot if history is repeating"
  ]
}

Respond ONLY with JSON. No preamble.`;

const config: FounderAgentConfig = {
  role: "historian",
  displayName: "The Historian",
  searchQueries: (input) => [
    `${input.name} OR "${input.description.substring(0, 60)}" similar startup failed history lessons`,
    `"${input.description.substring(0, 50)}" startup failure pattern historical precedent`,
  ],
  systemPrompt: SYSTEM_PROMPT,
  userPrompt: (input, ctx) => {
    // Find similar failures from database
    const tags = input.description.toLowerCase().split(/\s+/).filter((w) => w.length > 4).slice(0, 5);
    const archetype = input.stage === "Pre-launch" ? "no-pmf" : input.stage === "Scaling" ? "burn-rate" : "execution";
    const similar = findSimilarFailures(archetype, tags);

    const similarBlock = similar.length > 0
      ? `Similar past failures from our database:\n${similar.map((c, i) => `${i + 1}. ${c.name} (died ${c.yearDied}): ${c.oneLiner} — Archetype: ${c.archetype}`).join("\n")}`
      : "No similar cases found in database.";

    return `What historical pattern could kill this startup idea?\n\nName: ${input.name}\nDescription: ${input.description}\nStage: ${input.stage}${input.targetCustomer ? `\nTarget customer: ${input.targetCustomer}` : ""}\n\n${similarBlock}\n\nSearch evidence:\n${ctx.slice(0, 1500)}\n\nReturn JSON.`;
  },
};

export async function runFounderHistorian(input: FounderModeInput): Promise<FounderFinding> {
  return runFounderAgent(config, input);
}
