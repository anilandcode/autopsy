import { runMarketAnalyst } from "@/lib/agents/market-analyst";
import { runOperator } from "@/lib/agents/operator";
import { runMoneyTrail } from "@/lib/agents/money-trail";
import { runCustomerVoice } from "@/lib/agents/customer-voice";
import { runEngineer } from "@/lib/agents/engineer";
import { runHistorian } from "@/lib/agents/historian";
import { runSynthesizer } from "@/lib/agents/synthesizer";
import { AgentFinding, AgentRole, PostmortemReport } from "@/types/investigation";

const agentRunners: {
  role: AgentRole;
  run: (subject: string) => Promise<AgentFinding>;
}[] = [
  { role: "market-analyst", run: runMarketAnalyst },
  { role: "operator", run: runOperator },
  { role: "money-trail", run: runMoneyTrail },
  { role: "customer-voice", run: runCustomerVoice },
  { role: "engineer", run: runEngineer },
  { role: "historian", run: runHistorian },
];

function makeErrorFinding(role: AgentRole): AgentFinding {
  return {
    role,
    displayName: role,
    status: "error",
    primaryCause: "Agent encountered an error",
    evidence: [],
    confidence: 0,
    fullAnalysis: "This agent failed to complete its investigation.",
    sources: [],
  };
}

export async function runInvestigation(
  subject: string,
  onAgentUpdate: (finding: AgentFinding) => void,
  onAgentStarted?: (role: AgentRole) => void
): Promise<PostmortemReport> {
  async function runWithUpdate(
    runFn: () => Promise<AgentFinding>,
    role: AgentRole
  ): Promise<AgentFinding> {
    onAgentStarted?.(role);
    try {
      const result = await runFn();
      onAgentUpdate(result);
      return result;
    } catch {
      const errorFinding = makeErrorFinding(role);
      onAgentUpdate(errorFinding);
      return errorFinding;
    }
  }

  const results = await Promise.allSettled([
    runWithUpdate(() => runMarketAnalyst(subject), "market-analyst"),
    runWithUpdate(() => runOperator(subject), "operator"),
    runWithUpdate(() => runMoneyTrail(subject), "money-trail"),
    runWithUpdate(() => runCustomerVoice(subject), "customer-voice"),
    runWithUpdate(() => runEngineer(subject), "engineer"),
    runWithUpdate(() => runHistorian(subject), "historian"),
  ]);

  const findings: AgentFinding[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      findings.push(result.value);
    }
  });

  const report = await runSynthesizer(subject, findings);
  return report;
}
