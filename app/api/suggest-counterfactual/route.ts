import { complete, extractJSON } from "@/lib/llm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { subject, primaryCause } = await req.json();
    if (!subject || !primaryCause) {
      return NextResponse.json({ error: "Missing subject or primaryCause" }, { status: 400 });
    }

    const raw = await complete(
      "You suggest alternate decisions for failed companies. Always respond with valid JSON only.",
      `Given that ${subject} failed because: ${primaryCause}
Suggest ONE specific alternate decision they could have made that might have changed the outcome.
One sentence, specific and actionable.
Return JSON: { "suggestion": string }`,
      { maxTokens: 100, temperature: 0.7 }
    );

    let parsed: { suggestion?: string } = {};
    try {
      parsed = JSON.parse(extractJSON(raw));
    } catch {}

    return NextResponse.json({
      suggestion: parsed.suggestion || `What if they had addressed: ${primaryCause.split(".")[0].slice(0, 80)}?`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
