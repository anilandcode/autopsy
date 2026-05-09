import { complete } from "@/lib/llm";
import { webSearch, formatSearchResults } from "@/lib/search";
import { FounderFinding, AgentRole, RiskLevel, FounderModeInput } from "@/types/investigation";

export interface FounderAgentConfig {
  role: AgentRole;
  displayName: string;
  searchQueries: (input: FounderModeInput) => string[];
  systemPrompt: string;
  userPrompt: (input: FounderModeInput, searchContext: string) => string;
}

export async function runFounderAgent(
  config: FounderAgentConfig,
  input: FounderModeInput,
  deep = false
): Promise<FounderFinding> {
  const TIMEOUT_MS = deep ? 45000 : 25000;

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Agent ${config.role} timed out`)),
      TIMEOUT_MS
    )
  );

  const agentPromise = async (): Promise<FounderFinding> => {
    const queries = config.searchQueries(input);
    const allResults = await Promise.all(
      queries.map((q) =>
        webSearch(q, {
          maxResults: deep ? 5 : 3,
          searchDepth: deep ? "advanced" : "basic",
        })
      )
    );
    const flatResults = allResults.flat();
    const searchContext = formatSearchResults(flatResults);

    const userPrompt = config.userPrompt(input, searchContext);
    const rawOutput = await complete(config.systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: deep ? 2500 : 1500,
    });

    let parsed: Record<string, unknown> = {};
    try {
      const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch {
      parsed = {};
    }

    const validLevels: RiskLevel[] = ["low", "medium", "high", "critical"];
    const rawLevel = (parsed.severity as string) || "medium";
    const severity: RiskLevel = validLevels.includes(rawLevel as RiskLevel)
      ? (rawLevel as RiskLevel)
      : "medium";

    return {
      role: config.role,
      displayName: config.displayName,
      status: "done",
      topFailureMode: (parsed.topFailureMode as string) || "Analysis complete",
      severity,
      evidence: Array.isArray(parsed.evidence) ? (parsed.evidence as string[]) : [],
      fullAnalysis: (parsed.fullAnalysis as string) || rawOutput,
      mitigations: Array.isArray(parsed.mitigations) ? (parsed.mitigations as string[]) : [],
      sources: flatResults.slice(0, deep ? 5 : 3).map((r) => ({ title: r.title, url: r.url })),
    };
  };

  try {
    return await Promise.race([agentPromise(), timeoutPromise]);
  } catch {
    return {
      role: config.role,
      displayName: config.displayName,
      status: "error",
      topFailureMode: "Agent timed out",
      severity: "medium",
      evidence: [],
      fullAnalysis: `The ${config.displayName} agent timed out.`,
      mitigations: [],
      sources: [],
    };
  }
}
