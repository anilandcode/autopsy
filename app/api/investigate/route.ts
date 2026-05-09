import { runInvestigation } from "@/lib/orchestrator";
import { AgentFinding, AgentRole, AgentDebateOutput } from "@/types/investigation";

export const maxDuration = 55;

export async function POST(request: Request) {
  const { subject, deep } = await request.json();

  if (!subject?.trim()) {
    return new Response("Missing subject", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(type: string, data: unknown) {
        const payload = `data: ${JSON.stringify({ type, data })}\n\n`;
        controller.enqueue(encoder.encode(payload));
      }

      try {
        sendEvent("started", { subject, deep: !!deep });

        const report = await runInvestigation(
          subject,
          !!deep,
          (finding: AgentFinding) => {
            sendEvent("agent_update", finding);
          },
          (role: AgentRole) => {
            sendEvent("agent_started", { role });
          },
          () => {
            sendEvent("debate_started", {});
          },
          (debate: AgentDebateOutput[]) => {
            sendEvent("debate_complete", debate);
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
