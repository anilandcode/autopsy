import { runMarketAnalyst, runMarketAnalystPremortem } from "@/lib/agents/market-analyst";
import { runOperator, runOperatorPremortem } from "@/lib/agents/operator";
import { runMoneyTrail, runMoneyTrailPremortem } from "@/lib/agents/money-trail";
import { runCustomerVoice, runCustomerVoicePremortem } from "@/lib/agents/customer-voice";
import { runEngineer, runEngineerPremortem } from "@/lib/agents/engineer";
import { runHistorian, runHistorianPremortem } from "@/lib/agents/historian";
import { runSynthesizer } from "@/lib/agents/synthesizer";
import { runPremortemSynthesizer } from "@/lib/agents/premortem-synthesizer";
import { runFounderMarketAnalyst } from "@/lib/agents/founder-mode/founder-market-analyst";
import { runFounderOperator } from "@/lib/agents/founder-mode/founder-operator";
import { runFounderMoneyTrail } from "@/lib/agents/founder-mode/founder-money-trail";
import { runFounderCustomerVoice } from "@/lib/agents/founder-mode/founder-customer-voice";
import { runFounderEngineer } from "@/lib/agents/founder-mode/founder-engineer";
import { runFounderHistorian } from "@/lib/agents/founder-mode/founder-historian";
import { runFounderSynthesizer } from "@/lib/agents/founder-synthesizer";
import { runDebateRound } from "@/lib/agents/debate";
import { runCFMarketAnalyst } from "@/lib/agents/counterfactual/cf-market-analyst";
import { runCFOperator } from "@/lib/agents/counterfactual/cf-operator";
import { runCFMoneyTrail } from "@/lib/agents/counterfactual/cf-money-trail";
import { runCFCustomerVoice } from "@/lib/agents/counterfactual/cf-customer-voice";
import { runCFEngineer } from "@/lib/agents/counterfactual/cf-engineer";
import { runCFHistorian } from "@/lib/agents/counterfactual/cf-historian";
import { runCounterfactualSynthesizer } from "@/lib/agents/counterfactual/cf-synthesizer";
import { AgentFinding, AgentRole, PostmortemReport, PremortemFinding, PremortemReport, FounderFinding, FounderReport, FounderModeInput, AgentDebateOutput, CounterfactualInput, CounterfactualAgentFinding, CounterfactualReport } from "@/types/investigation";

const agentRunners: {
  role: AgentRole;
  run: (subject: string, deep: boolean) => Promise<AgentFinding>;
}[] = [
  { role: "market-analyst", run: runMarketAnalyst },
  { role: "operator", run: runOperator },
  { role: "money-trail", run: runMoneyTrail },
  { role: "customer-voice", run: runCustomerVoice },
  { role: "engineer", run: runEngineer },
  { role: "historian", run: runHistorian },
];

const premortemRunners: {
  role: AgentRole;
  run: (subject: string, deep: boolean) => Promise<PremortemFinding>;
}[] = [
  { role: "market-analyst", run: runMarketAnalystPremortem },
  { role: "operator", run: runOperatorPremortem },
  { role: "money-trail", run: runMoneyTrailPremortem },
  { role: "customer-voice", run: runCustomerVoicePremortem },
  { role: "engineer", run: runEngineerPremortem },
  { role: "historian", run: runHistorianPremortem },
];

const founderRunners: {
  role: AgentRole;
  run: (input: FounderModeInput, deep: boolean) => Promise<FounderFinding>;
}[] = [
  { role: "market-analyst", run: runFounderMarketAnalyst },
  { role: "operator", run: runFounderOperator },
  { role: "money-trail", run: runFounderMoneyTrail },
  { role: "customer-voice", run: runFounderCustomerVoice },
  { role: "engineer", run: runFounderEngineer },
  { role: "historian", run: runFounderHistorian },
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

function makePremortemErrorFinding(role: AgentRole): PremortemFinding {
  return {
    role,
    displayName: role,
    status: "error",
    topRisk: "Agent encountered an error",
    riskLevel: "medium",
    evidence: [],
    fullAnalysis: "This agent failed to complete its risk analysis.",
    earlyWarnings: [],
    sources: [],
  };
}

function makeFounderErrorFinding(role: AgentRole): FounderFinding {
  return {
    role,
    displayName: role,
    status: "error",
    topFailureMode: "Agent encountered an error",
    severity: "medium",
    evidence: [],
    fullAnalysis: "This agent failed to complete its analysis.",
    mitigations: [],
    sources: [],
  };
}

function makeCounterfactualErrorFinding(role: AgentRole): CounterfactualAgentFinding {
  return {
    role,
    displayName: role,
    status: "error",
    actualOutcome: "Agent encountered an error",
    alternateOutcome: "Agent encountered an error",
    wouldItHaveHelped: false,
    confidenceInAlterate: 0,
    reasoning: "This agent failed to complete its counterfactual analysis.",
    historicalPrecedents: [],
    sources: [],
  };
}

export async function runInvestigation(
  subject: string,
  deep: boolean,
  onAgentUpdate: (finding: AgentFinding) => void,
  onAgentStarted?: (role: AgentRole) => void,
  onDebateStarted?: () => void,
  onDebateComplete?: (debate: AgentDebateOutput[]) => void,
  onBatchComplete?: (batch: number, agents: AgentRole[]) => void
): Promise<PostmortemReport> {
  async function runOne(
    runFn: () => Promise<AgentFinding>,
    role: AgentRole
  ): Promise<AgentFinding> {
    onAgentStarted?.(role);
    try {
      const result = await runFn();
      onAgentUpdate(result);
      return result;
    } catch (err: any) {
      const errorFinding: AgentFinding = {
        role,
        displayName: role,
        status: "error",
        primaryCause: "Agent encountered an error",
        evidence: [],
        confidence: 0,
        fullAnalysis: err.message || "Unknown error",
        sources: [],
      };
      onAgentUpdate(errorFinding);
      return errorFinding;
    }
  }

  const allFindings: AgentFinding[] = [];

  // BATCH 1: Run 2 agents simultaneously
  const batch1 = await Promise.all([
    runOne(() => runMarketAnalyst(subject, deep), "market-analyst"),
    runOne(() => runOperator(subject, deep), "operator"),
  ]);
  allFindings.push(...batch1);
  onBatchComplete?.(1, ["market-analyst", "operator"]);

  // Small gap between batches (1.5 seconds)
  await new Promise((r) => setTimeout(r, 1500));

  // BATCH 2: Run 2 more agents simultaneously
  const batch2 = await Promise.all([
    runOne(() => runMoneyTrail(subject, deep), "money-trail"),
    runOne(() => runCustomerVoice(subject, deep), "customer-voice"),
  ]);
  allFindings.push(...batch2);
  onBatchComplete?.(2, ["money-trail", "customer-voice"]);

  // Small gap
  await new Promise((r) => setTimeout(r, 1500));

  // BATCH 3: Final 2 agents simultaneously
  const batch3 = await Promise.all([
    runOne(() => runEngineer(subject, deep), "engineer"),
    runOne(() => runHistorian(subject, deep), "historian"),
  ]);
  allFindings.push(...batch3);
  onBatchComplete?.(3, ["engineer", "historian"]);

  // Now all 6 have data — run debate
  // Small gap before debate
  await new Promise((r) => setTimeout(r, 1000));

  // Run debate round with all findings
  let debateOutputs: AgentDebateOutput[] = [];
  try {
    if (typeof runDebateRound === "function") {
      debateOutputs = await runDebateRound(allFindings);
    }
  } catch (err) {
    console.error("Debate round failed:", err);
    debateOutputs = [];
  }

  onDebateStarted?.();
  onDebateComplete?.(debateOutputs);

  // Run synthesizer with all findings + debate
  const successfulFindings = allFindings.filter(
    (f) => f.status === "done"
  );

  const report = await runSynthesizer(subject, successfulFindings, debateOutputs);
  report.agentFindings = allFindings;

  if (debateOutputs.length) {
    (report as any).debateRound = debateOutputs;
  }

  return report;
}

export async function runPremortem(
  subject: string,
  deep: boolean,
  onAgentUpdate: (finding: PremortemFinding) => void,
  onAgentStarted?: (role: AgentRole) => void
): Promise<PremortemReport> {
  async function runOne(
    runFn: () => Promise<PremortemFinding>,
    role: AgentRole
  ): Promise<PremortemFinding> {
    onAgentStarted?.(role);
    try {
      const result = await runFn();
      onAgentUpdate(result);
      return result;
    } catch (err: any) {
      const errorFinding: PremortemFinding = {
        role,
        displayName: role,
        status: "error",
        topRisk: "Agent encountered an error",
        riskLevel: "medium",
        evidence: [],
        fullAnalysis: err.message || "Unknown error",
        earlyWarnings: [],
        sources: [],
      };
      onAgentUpdate(errorFinding);
      return errorFinding;
    }
  }

  const allFindings: PremortemFinding[] = [];

  const batch1 = await Promise.all([
    runOne(() => runMarketAnalystPremortem(subject, deep), "market-analyst"),
    runOne(() => runOperatorPremortem(subject, deep), "operator"),
  ]);
  allFindings.push(...batch1);

  await new Promise((r) => setTimeout(r, 1500));

  const batch2 = await Promise.all([
    runOne(() => runMoneyTrailPremortem(subject, deep), "money-trail"),
    runOne(() => runCustomerVoicePremortem(subject, deep), "customer-voice"),
  ]);
  allFindings.push(...batch2);

  await new Promise((r) => setTimeout(r, 1500));

  const batch3 = await Promise.all([
    runOne(() => runEngineerPremortem(subject, deep), "engineer"),
    runOne(() => runHistorianPremortem(subject, deep), "historian"),
  ]);
  allFindings.push(...batch3);

  return runPremortemSynthesizer(subject, allFindings);
}

export async function runFounderMode(
  input: FounderModeInput,
  deep: boolean,
  onAgentUpdate: (finding: FounderFinding) => void,
  onAgentStarted?: (role: AgentRole) => void
): Promise<FounderReport> {
  async function runOne(
    runFn: () => Promise<FounderFinding>,
    role: AgentRole
  ): Promise<FounderFinding> {
    onAgentStarted?.(role);
    try {
      const result = await runFn();
      onAgentUpdate(result);
      return result;
    } catch (err: any) {
      const errorFinding: FounderFinding = {
        role,
        displayName: role,
        status: "error",
        topFailureMode: "Agent encountered an error",
        severity: "medium",
        evidence: [],
        fullAnalysis: err.message || "Unknown error",
        mitigations: [],
        sources: [],
      };
      onAgentUpdate(errorFinding);
      return errorFinding;
    }
  }

  const allFindings: FounderFinding[] = [];

  const batch1 = await Promise.all([
    runOne(() => runFounderMarketAnalyst(input, deep), "market-analyst"),
    runOne(() => runFounderOperator(input, deep), "operator"),
  ]);
  allFindings.push(...batch1);

  await new Promise((r) => setTimeout(r, 1500));

  const batch2 = await Promise.all([
    runOne(() => runFounderMoneyTrail(input, deep), "money-trail"),
    runOne(() => runFounderCustomerVoice(input, deep), "customer-voice"),
  ]);
  allFindings.push(...batch2);

  await new Promise((r) => setTimeout(r, 1500));

  const batch3 = await Promise.all([
    runOne(() => runFounderEngineer(input, deep), "engineer"),
    runOne(() => runFounderHistorian(input, deep), "historian"),
  ]);
  allFindings.push(...batch3);

  return runFounderSynthesizer(input, allFindings);
}

export async function runCounterfactual(
  input: CounterfactualInput,
  deep: boolean,
  onAgentUpdate: (finding: CounterfactualAgentFinding) => void,
  onAgentStarted?: (role: AgentRole) => void
): Promise<CounterfactualReport> {
  async function runOne(
    runFn: () => Promise<CounterfactualAgentFinding>,
    role: AgentRole
  ): Promise<CounterfactualAgentFinding> {
    onAgentStarted?.(role);
    try {
      const result = await runFn();
      onAgentUpdate(result);
      return result;
    } catch (err: any) {
      const errorFinding: CounterfactualAgentFinding = {
        role,
        displayName: role,
        status: "error",
        actualOutcome: "Agent encountered an error",
        alternateOutcome: "Agent encountered an error",
        wouldItHaveHelped: false,
        confidenceInAlterate: 0,
        reasoning: err.message || "Unknown error",
        historicalPrecedents: [],
        sources: [],
      };
      onAgentUpdate(errorFinding);
      return errorFinding;
    }
  }

  const allFindings: CounterfactualAgentFinding[] = [];

  const batch1 = await Promise.all([
    runOne(() => runCFMarketAnalyst(input, deep), "market-analyst"),
    runOne(() => runCFOperator(input, deep), "operator"),
  ]);
  allFindings.push(...batch1);

  await new Promise((r) => setTimeout(r, 1500));

  const batch2 = await Promise.all([
    runOne(() => runCFMoneyTrail(input, deep), "money-trail"),
    runOne(() => runCFCustomerVoice(input, deep), "customer-voice"),
  ]);
  allFindings.push(...batch2);

  await new Promise((r) => setTimeout(r, 1500));

  const batch3 = await Promise.all([
    runOne(() => runCFEngineer(input, deep), "engineer"),
    runOne(() => runCFHistorian(input, deep), "historian"),
  ]);
  allFindings.push(...batch3);

  return runCounterfactualSynthesizer(input, allFindings);
}
