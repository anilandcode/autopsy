import { NextResponse } from "next/server";

export async function GET() {
  const LLM_API_KEY = process.env.LLM_API_KEY;
  const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
  const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://api.fireworks.ai/inference/v1";
  const LLM_MODEL = process.env.LLM_MODEL || "accounts/fireworks/models/deepseek-v4-pro";

  const issues: string[] = [];

  if (!LLM_API_KEY || LLM_API_KEY.trim() === "") {
    issues.push("LLM_API_KEY is not set");
  }
  if (!TAVILY_API_KEY || TAVILY_API_KEY.trim() === "") {
    issues.push("TAVILY_API_KEY is not set — search will return no results");
  }

  if (issues.length > 0) {
    return NextResponse.json(
      {
        error: issues.join("; "),
        env: {
          baseURL: LLM_BASE_URL,
          model: LLM_MODEL,
          keyPrefix: LLM_API_KEY?.slice(0, 8) || "(empty)",
        },
      },
      { status: 200 } // 200 so client can read the error message
    );
  }

  return NextResponse.json({
    ok: true,
    env: {
      baseURL: LLM_BASE_URL,
      model: LLM_MODEL,
      keyPrefix: LLM_API_KEY?.slice(0, 8),
    },
  });
}
