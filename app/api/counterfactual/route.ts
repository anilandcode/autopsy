import { runCounterfactual } from "@/lib/orchestrator";
import { CounterfactualAgentFinding, AgentRole } from "@/types/investigation";

export const maxDuration = 55;

export async function POST(request: Request) {
  const body = await request.json();
  const { subject, originalDecision, alternateDecision, context, deep } = body;

  if (!subject?.trim() || !originalDecision?.trim() || !alternateDecision?.trim()) {
    return new Response("Missing required fields: subject, originalDecision, alternateDecision", { status: 400 });
  }

  const input = { subject, originalDecision, alternateDecision, context };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(type: string, data: unknown) {
        const payload = `data: ${JSON.stringify({ type, data })}\n\n`;
        controller.enqueue(encoder.encode(payload));
      }

      try {
        sendEvent("started", { input, deep: !!deep });

        const report = await runCounterfactual(
          input,
          !!deep,
          (finding: CounterfactualAgentFinding) => {
            sendEvent("cf_agent_update", finding);
          },
          (role: AgentRole) => {
            sendEvent("cf_agent_started", { role });
          }
        );

        sendEvent("cf_complete", report);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        sendEvent("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
