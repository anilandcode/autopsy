import { complete } from "@/lib/llm";
import { webSearch, formatSearchResults } from "@/lib/search";
import { PremortemFinding, AgentRole, RiskLevel } from "@/types/investigation";

export interface PremortemAgentConfig {
  role: AgentRole;
  displayName: string;
  searchQueries: (subject: string) => string[];
  systemPrompt: string;
  userPrompt: (subject: string, searchContext: string) => string;
}

export async function runPremortemAgent(
  config: PremortemAgentConfig,
  subject: string
): Promise<PremortemFinding> {
  const TIMEOUT_MS = 25000;

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Agent ${config.role} timed out`)),
      TIMEOUT_MS
    )
  );

  const agentPromise = async (): Promise<PremortemFinding> => {
    // Step 1: web search — risk-focused queries
    const queries = config.searchQueries(subject);
    const allResults = await Promise.all(
      queries.map((q) => webSearch(q, { maxResults: 3, searchDepth: "basic" }))
    );
    const flatResults = allResults.flat();
    const searchContext = formatSearchResults(flatResults);

    // Step 2: LLM analysis — prospective framing
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

    const validLevels: RiskLevel[] = ["low", "medium", "high", "critical"];
    const rawLevel = (parsed.riskLevel as string) || "medium";
    const riskLevel: RiskLevel = validLevels.includes(rawLevel as RiskLevel)
      ? (rawLevel as RiskLevel)
      : "medium";

    return {
      role: config.role,
      displayName: config.displayName,
      status: "done",
      topRisk: (parsed.topRisk as string) || "Risk analysis complete",
      riskLevel,
      evidence: Array.isArray(parsed.evidence)
        ? (parsed.evidence as string[])
        : [],
      fullAnalysis: (parsed.fullAnalysis as string) || rawOutput,
      earlyWarnings: Array.isArray(parsed.earlyWarnings)
        ? (parsed.earlyWarnings as string[])
        : [],
      sources: flatResults
        .slice(0, 3)
        .map((r) => ({ title: r.title, url: r.url })),
    };
  };

  try {
    return await Promise.race([agentPromise(), timeoutPromise]);
  } catch {
    return {
      role: config.role,
      displayName: config.displayName,
      status: "error",
      topRisk: "Agent timed out — insufficient data available",
      riskLevel: "medium",
      evidence: [],
      fullAnalysis: `The ${config.displayName} agent timed out while analyzing ${subject}.`,
      earlyWarnings: [],
      sources: [],
    };
  }
}
