import { runFounderMode } from "@/lib/orchestrator";
import { FounderFinding, AgentRole, FounderModeInput } from "@/types/investigation";

export const maxDuration = 55;

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, stage, targetCustomer } = body;

  if (!name?.trim() || !description?.trim() || !stage) {
    return new Response("Missing required fields: name, description, stage", { status: 400 });
  }

  const input: FounderModeInput = {
    name: name.trim(),
    description: description.trim(),
    stage,
    targetCustomer: targetCustomer?.trim() || undefined,
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(type: string, data: unknown) {
        const payload = `data: ${JSON.stringify({ type, data })}\n\n`;
        controller.enqueue(encoder.encode(payload));
      }

      try {
        sendEvent("started", { name: input.name });

        const report = await runFounderMode(
          input,
          (finding: FounderFinding) => {
            sendEvent("agent_update", finding);
          },
          (role: AgentRole) => {
            sendEvent("agent_started", { role });
          }
        );

        sendEvent("complete", report);
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
