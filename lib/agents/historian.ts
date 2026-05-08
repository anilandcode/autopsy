import { runAgent } from "./base";
import { runPremortemAgent } from "./base-premortem";
import { AgentFinding, PremortemFinding } from "@/types/investigation";
import { findSimilarFailures } from "@/lib/failure-database";

const SYSTEM_PROMPT = `You are the Historian agent in a startup postmortem investigation. You pattern-match current failures to historical precedents. You have seen every startup failure cycle since the 1990s dot-com era.

Your personality: Thoughtful, references the past constantly, slightly world-weary. You say things like "This is exactly what happened to..." You believe history always repeats in startup land.

You have access to a database of 30 famous startup failures. Three most-similar cases are provided in the user prompt. You MUST reference at least 2 of them BY NAME AND YEAR in your analysis. You also MUST identify which archetype the current subject matches from this list: premium-bet, founder-ego, wrong-timing, no-pmf, burn-rate, regulatory, execution, competition.

You ALWAYS respond with valid JSON in this exact format — nothing else:
{
  "primaryCause": "One sharp sentence naming the historical pattern that killed it",
  "confidence": <number 65-90>,
  "evidence": [
    "Historical parallel 1: [Company, Year] — exactly what happened",
    "Historical parallel 2: [Company, Year] — exactly what happened",
    "The pattern that connects them all"
  ],
  "archetype": "<one of: premium-bet, founder-ego, wrong-timing, no-pmf, burn-rate, regulatory, execution, competition>",
  "fullAnalysis": "3 paragraphs. Para 1: the historical pattern this failure fits and which archetype it belongs to. Para 2: specific company parallels from the database with names, years, and outcomes. Para 3: what founders could have learned from history."
}

CRITICAL: Respond ONLY with the JSON object. No text before or after.
Keep fullAnalysis under 400 words total.`;

const PREMORTEM_SYSTEM_PROMPT = `You are the Historian agent performing a PRE-MORTEM risk analysis on a LIVING company. You pattern-match CURRENT risks to historical precedents. You have seen every startup failure cycle since the 1990s dot-com era.

Your personality: Thoughtful, references the past constantly, slightly world-weary. You say things like "This is heading exactly where [Company] went..."

You have access to a database of 30 famous startup failures. Three most-similar cases are provided in the user prompt. You MUST reference at least 2 of them BY NAME AND YEAR as cautionary parallels. You also MUST identify which archetype the current subject is most vulnerable to from this list: premium-bet, founder-ego, wrong-timing, no-pmf, burn-rate, regulatory, execution, competition.

You ALWAYS respond with valid JSON in this exact format — nothing else:
{
  "topRisk": "One sharp sentence — the historical pattern most likely to repeat and kill this company",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "evidence": [
    "Cautionary parallel 1: [Company, Year] — what happened and how it could repeat here",
    "Cautionary parallel 2: [Company, Year] — what happened and how it could repeat here",
    "The pattern that connects them and applies to this company"
  ],
  "archetype": "<one of: premium-bet, founder-ego, wrong-timing, no-pmf, burn-rate, regulatory, execution, competition>",
  "fullAnalysis": "3 paragraphs. Para 1: which historical archetype this company is most vulnerable to. Para 2: specific company parallels with names, years, and the warning signs that preceded their fall. Para 3: what this company must avoid to not become the next case study.",
  "earlyWarnings": [
    "Specific signal 1 to watch for — drawn from historical parallels",
    "Specific signal 2 to watch for",
    "Specific signal 3 to watch for"
  ]
}

CRITICAL: Respond ONLY with the JSON object. No text before or after.
Keep fullAnalysis under 400 words total.`;

function inferArchetypeAndTags(subject: string): { archetype: string; tags: string[] } {
  const lower = subject.toLowerCase();
  const tagMap: Record<string, string[]> = {
    "e-commerce": ["e-commerce", "marketplace"],
    "social": ["social", "network-effects"],
    "streaming": ["streaming", "subscription"],
    "food": ["food-delivery", "subscription"],
    "health": ["healthcare", "biotech", "regulatory"],
    "hardware": ["hardware", "iot"],
    "clean energy": ["clean-energy", "infrastructure"],
    "real estate": ["real-estate", "marketplace"],
    "retail": ["retail", "e-commerce"],
    "automotive": ["automotive", "hardware"],
    "mobile": ["mobile", "app"],
    "ar": ["ar", "hardware", "overpromised"],
    "wearable": ["wearables", "hardware"],
    "d2c": ["d2c", "subscription"],
    "delivery": ["delivery", "logistics", "on-demand"],
    "gig": ["gig-economy", "on-demand", "marketplace"],
    "ai": ["ai", "technology"],
    "saas": ["saas", "subscription", "b2b"],
    "devtools": ["developer-tools", "saas"],
  };

  const tags: string[] = [];
  for (const [keyword, t] of Object.entries(tagMap)) {
    if (lower.includes(keyword)) tags.push(...t);
  }
  if (tags.length === 0) tags.push("startup", "technology");

  const archetypeMap: Record<string, string> = {
    "fraud": "founder-ego",
    "scam": "founder-ego",
    "cult": "founder-ego",
    "ego": "founder-ego",
    "late": "wrong-timing",
    "timing": "wrong-timing",
    "pandemic": "wrong-timing",
    "premature": "wrong-timing",
    "burn": "burn-rate",
    "cash": "burn-rate",
    "unit economics": "burn-rate",
    "overspend": "burn-rate",
    "regulation": "regulatory",
    "fda": "regulatory",
    "compliance": "regulatory",
    "lawsuit": "regulatory",
    "compete": "competition",
    "rival": "competition",
    "dominated": "competition",
    "crushed": "competition",
    "moat": "competition",
    "premium": "premium-bet",
    "luxury": "premium-bet",
    "overengineer": "premium-bet",
    "niche": "no-pmf",
    "no demand": "no-pmf",
    "hype": "no-pmf",
    "pivot": "execution",
    "neglect": "execution",
    "leadership": "execution",
  };

  let archetype = "execution"; // default
  for (const [keyword, arch] of Object.entries(archetypeMap)) {
    if (lower.includes(keyword)) {
      archetype = arch;
      break;
    }
  }

  return { archetype, tags };
}

function buildSimilarBlock(subject: string): string {
  const { archetype, tags } = inferArchetypeAndTags(subject);
  const similar = findSimilarFailures(archetype, tags);
  return similar.length > 0
    ? `Similar past failures from our database:\n${similar
        .map(
          (c, i) =>
            `${i + 1}. ${c.name} (died ${c.yearDied}): ${c.oneLiner} — Archetype: ${c.archetype}`
        )
        .join("\n")}`
    : "No similar cases found in database.";
}

export async function runHistorian(subject: string): Promise<AgentFinding> {
  const similarBlock = buildSimilarBlock(subject);

  return runAgent(
    {
      role: "historian",
      displayName: "The Historian",
      searchQueries: (s) => [
        `${s} similar startup failures history lessons`,
      ],
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: (s, ctx) =>
        `What historical pattern does ${s}'s failure match?\n\n${similarBlock}\n\nEvidence from research:\n${ctx.slice(0, 1800)}\n\nReturn JSON only.`,
    },
    subject
  );
}

export async function runHistorianPremortem(subject: string): Promise<PremortemFinding> {
  const similarBlock = buildSimilarBlock(subject);

  return runPremortemAgent(
    {
      role: "historian",
      displayName: "The Historian",
      searchQueries: (s) => [
        `${s} risks challenges similar failed companies history`,
      ],
      systemPrompt: PREMORTEM_SYSTEM_PROMPT,
      userPrompt: (s, ctx) =>
        `What historical pattern could repeat and kill ${s}?\n\n${similarBlock}\n\nEvidence from research:\n${ctx.slice(0, 1800)}\n\nReturn JSON only.`,
    },
    subject
  );
}
