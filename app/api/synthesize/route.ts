import { runSynthesizer } from "@/lib/agents/synthesizer";
import { AgentFinding } from "@/types/investigation";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { subject, findings } = await request.json();

    if (!subject || !Array.isArray(findings)) {
      return new Response(
        JSON.stringify({ error: "Missing subject or findings" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const report = await runSynthesizer(
      subject,
      findings as AgentFinding[]
    );

    return new Response(JSON.stringify(report), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
