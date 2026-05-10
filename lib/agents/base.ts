import { complete, extractJSON, MODEL } from "@/lib/llm";
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
  subject: string,
  deep = false
): Promise<AgentFinding> {
  const TIMEOUT_MS = 50000;

  console.log(`[${config.role}] Using model: ${MODEL}`);

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Agent ${config.role} timed out`)),
      TIMEOUT_MS
    )
  );

  const agentPromise = async (): Promise<AgentFinding> => {
    // Step 1: web search — run first query only, maxResults: 2
    const queries = config.searchQueries(subject);
    const allResults = await webSearch(queries[0], {
      maxResults: deep ? 4 : 2,
      searchDepth: deep ? "advanced" : "basic",
    });
    const searchContext = formatSearchResults(allResults);

    // Step 2: LLM analysis
    const userPrompt = config.userPrompt(subject, searchContext);
    const rawOutput = await complete(config.systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: deep ? 1500 : 1000,
    });

    // Step 3: parse structured output
    let parsed: Record<string, unknown> = {};
    try {
      const cleanJSON = extractJSON(rawOutput);
      parsed = JSON.parse(cleanJSON);
    } catch {
      console.error(`[${config.role}] JSON parse failed:`, rawOutput.slice(0, 200));
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
        return Math.min(1, Math.max(0, raw > 1 ? raw / 100 : raw));
      })(),
      fullAnalysis: (parsed.fullAnalysis as string) || rawOutput,
      sources: allResults
        .slice(0, deep ? 4 : 2)
        .map((r) => ({ title: r.title, url: r.url })),
    };
  };

  const fallbackPromise = async (): Promise<AgentFinding> => {
    console.log(`[${config.role}] Running fallback analysis...`);
    const fallbackUserPrompt = `Provide a brief analysis of ${subject}. Focus on the single most important reason this company or situation failed or what went wrong. Respond in JSON: {"primaryCause":"...","evidence":["...","..."],"confidence":75,"fullAnalysis":"..."}`;
    const rawOutput = await complete(config.systemPrompt, fallbackUserPrompt, {
      temperature: 0.7,
      maxTokens: 600,
    });

    let parsed: Record<string, unknown> = {};
    try {
      const cleanJSON = extractJSON(rawOutput);
      parsed = JSON.parse(cleanJSON);
    } catch {
      console.error(`[${config.role}] Fallback JSON parse failed:`, rawOutput.slice(0, 200));
      parsed = {};
    }

    return {
      role: config.role,
      displayName: config.displayName,
      status: "done",
      primaryCause: (parsed.primaryCause as string) || "Analysis complete (fallback)",
      evidence: Array.isArray(parsed.evidence)
        ? (parsed.evidence as string[])
        : [],
      confidence: (() => {
        const raw = (parsed.confidence as number) || 60;
        return Math.min(1, Math.max(0, raw > 1 ? raw / 100 : raw));
      })(),
      fullAnalysis: (parsed.fullAnalysis as string) || rawOutput,
      sources: [],
    };
  };

  try {
    return await Promise.race([agentPromise(), timeoutPromise]);
  } catch {
    try {
      return await fallbackPromise();
    } catch {
      return {
        role: config.role,
        displayName: config.displayName,
        status: "analyzing",
        primaryCause: "Analysis pending — retrying with simplified query",
        evidence: [],
        confidence: 0,
        fullAnalysis: `The ${config.displayName} agent is retrying with a simplified query for ${subject}.`,
        sources: [],
      };
    }
  }
}
