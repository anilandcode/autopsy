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

function makeErrorFinding(role: AgentRole, displayName: string): AgentFinding {
  return {
    role,
    displayName,
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
  onAgentUpdate: (finding: AgentFinding) => void
): Promise<PostmortemReport> {
  // Run all 6 agents in parallel
  const results = await Promise.allSettled(
    agentRunners.map((agent) => agent.run(subject))
  );

  // Process results
  const findings: AgentFinding[] = [];

  results.forEach((result, i) => {
    const agent = agentRunners[i];
    if (result.status === "fulfilled") {
      onAgentUpdate(result.value);
      findings.push(result.value);
    } else {
      const errorFinding = makeErrorFinding(agent.role, agent.role);
      onAgentUpdate(errorFinding);
      findings.push(errorFinding);
    }
  });

  // Synthesize final report
  const report = await runSynthesizer(subject, findings);
  return report;
}
