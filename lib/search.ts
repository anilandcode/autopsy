export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export async function webSearch(
  query: string,
  options?: { maxResults?: number; searchDepth?: "basic" | "advanced" }
): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  const body = {
    api_key: apiKey,
    query,
    search_depth: options?.searchDepth || "basic",
    max_results: options?.maxResults || 5,
    include_answer: false,
  };

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error(`Tavily search failed (${res.status}): ${errorText}`);
      return [];
    }

    const data = await res.json();
    return (data.results || []) as SearchResult[];
  } catch (err) {
    console.error("Tavily search error:", err);
    return [];
  }
}

export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) return "No search results found.";

  return results
    .map(
      (r, i) =>
        `[Source ${i + 1}: ${r.title}]\n${r.content}\nURL: ${r.url}`
    )
    .join("\n---\n");
}
