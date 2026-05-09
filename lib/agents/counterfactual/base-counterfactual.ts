import { complete } from "@/lib/llm";
import { webSearch, formatSearchResults } from "@/lib/search";
import { CounterfactualAgentFinding, AgentRole, CounterfactualInput } from "@/types/investigation";

export interface CounterfactualAgentConfig {
  role: AgentRole;
  displayName: string;
  searchQueries: (input: CounterfactualInput) => string[];
  systemPrompt: string;
  userPrompt: (input: CounterfactualInput, searchContext: string) => string;
}

export async function runCounterfactualAgent(
  config: CounterfactualAgentConfig,
  input: CounterfactualInput
): Promise<CounterfactualAgentFinding> {
  const TIMEOUT_MS = 28000;

  const agentWork = async (): Promise<CounterfactualAgentFinding> => {
    // Search for evidence
    const queries = config.searchQueries(input);
    const allResults = await Promise.all(
      queries.map(q => webSearch(q, { maxResults: 3 }))
    );
    const searchContext = formatSearchResults(allResults.flat());

    // LLM call
    const raw = await complete(
      config.systemPrompt,
      config.userPrompt(input, searchContext),
      { temperature: 0.8, maxTokens: 1500 }
    );

    // Parse JSON
    let parsed: Record<string, unknown> = {};
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    } catch { parsed = {}; }

    return {
      role: config.role,
      displayName: config.displayName,
      status: "done",
      actualOutcome: (parsed.actualOutcome as string) || "",
      alternateOutcome: (parsed.alternateOutcome as string) || "",
      wouldItHaveHelped: (parsed.wouldItHaveHelped as boolean) ?? true,
      confidenceInAlterate: Math.min(100, Math.max(0, (parsed.confidence as number) || 70)),
      reasoning: (parsed.reasoning as string) || raw,
      historicalPrecedents: (parsed.historicalPrecedents as string[]) || [],
      sources: allResults.flat().slice(0, 3).map(r => ({
        title: r.title,
        url: r.url
      })),
    };
  };

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)
  );

  try {
    return await Promise.race([agentWork(), timeout]);
  } catch {
    return {
      role: config.role,
      displayName: config.displayName,
      status: "error",
      actualOutcome: "Analysis timed out",
      alternateOutcome: "Analysis timed out",
      wouldItHaveHelped: false,
      confidenceInAlterate: 0,
      reasoning: "Agent timed out",
      historicalPrecedents: [],
      sources: [],
    };
  }
}
