import { NextResponse } from "next/server";
import { complete } from "@/lib/llm";

export async function GET() {
  const start = Date.now();
  try {
    const result = await complete(
      "You are helpful. Always respond with valid JSON only.",
      'Respond with exactly this JSON: {"status": "ok", "model": "kimi"}',
      { maxTokens: 30, temperature: 0 }
    );
    return NextResponse.json({
      raw: result,
      elapsed_ms: Date.now() - start,
      model: process.env.LLM_MODEL,
      baseURL: process.env.LLM_BASE_URL,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: message,
        elapsed_ms: Date.now() - start,
        model: process.env.LLM_MODEL,
      },
      { status: 500 }
    );
  }
}
