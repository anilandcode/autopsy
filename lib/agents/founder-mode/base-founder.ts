import { complete, extractJSON } from "@/lib/llm";
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
  const TIMEOUT_MS = 40000;

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Agent ${config.role} timed out`)),
      TIMEOUT_MS
    )
  );

  const agentPromise = async (): Promise<FounderFinding> => {
    const queries = config.searchQueries(input);
    const allResults = await webSearch(queries[0], {
      maxResults: deep ? 4 : 2,
      searchDepth: deep ? "advanced" : "basic",
    });
    const searchContext = formatSearchResults(allResults);

    const userPrompt = config.userPrompt(input, searchContext);
    const rawOutput = await complete(config.systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: deep ? 1500 : 1000,
    });

    let parsed: Record<string, unknown> = {};
    try {
      const cleanJSON = extractJSON(rawOutput);
      parsed = JSON.parse(cleanJSON);
    } catch {
      console.error(`[${config.role}] JSON parse failed:`, rawOutput.slice(0, 200));
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
      sources: allResults.slice(0, deep ? 4 : 2).map((r) => ({ title: r.title, url: r.url })),
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
