import { NextResponse } from "next/server";
import { complete } from "@/lib/llm";
import { webSearch, formatSearchResults } from "@/lib/search";

export async function GET() {
  console.log("ENV CHECK:", {
    LLM_BASE_URL: process.env.LLM_BASE_URL,
    LLM_MODEL: process.env.LLM_MODEL,
    LLM_API_KEY_PREFIX: process.env.LLM_API_KEY?.slice(0, 8),
    TAVILY_KEY_PREFIX: process.env.TAVILY_API_KEY?.slice(0, 6),
  });

  try {
    const llmResult = await complete(
      "You are a startup historian.",
      "In one sentence, why did Quibi fail?"
    );

    const searchResults = await webSearch("why did Quibi fail", {
      maxResults: 3,
    });

    return NextResponse.json({
      env: {
        baseURL: process.env.LLM_BASE_URL,
        model: process.env.LLM_MODEL,
        keyPrefix: process.env.LLM_API_KEY?.slice(0, 8),
      },
      llm: llmResult,
      searchResultsCount: searchResults.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: message,
        env: {
          baseURL: process.env.LLM_BASE_URL,
          model: process.env.LLM_MODEL,
          keyPrefix: process.env.LLM_API_KEY?.slice(0, 8),
        },
      },
      { status: 500 }
    );
  }
}
