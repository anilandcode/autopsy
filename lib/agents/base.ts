import { complete } from "@/lib/llm";
import { webSearch, formatSearchResults } from "@/lib/search";
import { AgentFinding, AgentRole } from "@/types/investigation";

export interface AgentConfig {
  role: AgentRole;
  displayName: string;
  searchQueries: (subject: string) => string[];
  systemPrompt: string;
  userPrompt: (subject: string, searchContext: string) => string;
}

export async function runAgent(
  config: AgentConfig,
  subject: string
): Promise<AgentFinding> {
  // Step 1: web search
  const queries = config.searchQueries(subject);
  const allResults = await Promise.all(
    queries.map((q) => webSearch(q, { maxResults: 3, searchDepth: "basic" }))
  );
  const flatResults = allResults.flat();
  const searchContext = formatSearchResults(flatResults);

  // Step 2: LLM analysis
  const userPrompt = config.userPrompt(subject, searchContext);
  const rawOutput = await complete(config.systemPrompt, userPrompt, {
    temperature: 0.7,
    maxTokens: 1500,
  });

  // Step 3: parse structured output
  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    parsed = {};
  }

  return {
    role: config.role,
    displayName: config.displayName,
    status: "done",
    primaryCause: (parsed.primaryCause as string) || "Analysis complete",
    evidence: Array.isArray(parsed.evidence)
      ? (parsed.evidence as string[])
      : [],
    confidence: (() => {
      const raw = (parsed.confidence as number) || 75;
      // Normalize to 0-1 scale
      return Math.min(1, Math.max(0, raw > 1 ? raw / 100 : raw));
    })(),
    fullAnalysis: (parsed.fullAnalysis as string) || rawOutput,
    sources: flatResults
      .slice(0, 3)
      .map((r) => ({ title: r.title, url: r.url })),
  };
}
