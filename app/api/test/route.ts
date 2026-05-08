import { NextResponse } from "next/server";
import { complete } from "@/lib/llm";
import { webSearch, formatSearchResults } from "@/lib/search";

export async function GET() {
  try {
    const llm = await complete(
      "You are a startup historian.",
      "In one sentence, why did Quibi fail?"
    );

    const results = await webSearch("why did Quibi fail", { maxResults: 3 });
    const formatted = formatSearchResults(results);

    return NextResponse.json({
      llm,
      searchResultsCount: results.length,
      searchSample: formatted.slice(0, 500),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
