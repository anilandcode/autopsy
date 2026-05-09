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

export async function runInvestigation(
  subject: string,
  deep: boolean,
  onAgentUpdate: (finding: AgentFinding) => void,
  onAgentStarted?: (role: AgentRole) => void,
  onDebateStarted?: () => void,
  onDebateComplete?: (debate: AgentDebateOutput[]) => void
): Promise<PostmortemReport> {
  async function runWithUpdate(
    runFn: (deep: boolean) => Promise<AgentFinding>,
    role: AgentRole
  ): Promise<AgentFinding> {
    onAgentStarted?.(role);
    try {
      const result = await runFn(deep);
      onAgentUpdate(result);
      return result;
    } catch {
      const errorFinding = makeErrorFinding(role);
      onAgentUpdate(errorFinding);
      return errorFinding;
    }
  }

  const results = await Promise.allSettled([
    runWithUpdate(() => runMarketAnalyst(subject, deep), "market-analyst"),
    runWithUpdate(() => runOperator(subject, deep), "operator"),
    runWithUpdate(() => runMoneyTrail(subject, deep), "money-trail"),
    runWithUpdate(() => runCustomerVoice(subject, deep), "customer-voice"),
    runWithUpdate(() => runEngineer(subject, deep), "engineer"),
    runWithUpdate(() => runHistorian(subject, deep), "historian"),
  ]);

  const findings: AgentFinding[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled") findings.push(result.value);
  });

  // Debate round
  onDebateStarted?.();
  const debateOutputs = await runDebateRound(findings);
  onDebateComplete?.(debateOutputs);

  return runSynthesizer(subject, findings, debateOutputs);
}

export async function runPremortem(
  subject: string,
  deep: boolean,
  onAgentUpdate: (finding: PremortemFinding) => void,
  onAgentStarted?: (role: AgentRole) => void
): Promise<PremortemReport> {
  async function runWithUpdate(
    runFn: (deep: boolean) => Promise<PremortemFinding>,
    role: AgentRole
  ): Promise<PremortemFinding> {
    onAgentStarted?.(role);
    try {
      const result = await runFn(deep);
      onAgentUpdate(result);
      return result;
    } catch {
      const errorFinding = makePremortemErrorFinding(role);
      onAgentUpdate(errorFinding);
      return errorFinding;
    }
  }

  const results = await Promise.allSettled(
    premortemRunners.map(({ role, run }) =>
      runWithUpdate(() => run(subject, deep), role)
    )
  );

  const findings: PremortemFinding[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled") findings.push(result.value);
  });

  return runPremortemSynthesizer(subject, findings);
}

export async function runFounderMode(
  input: FounderModeInput,
  deep: boolean,
  onAgentUpdate: (finding: FounderFinding) => void,
  onAgentStarted?: (role: AgentRole) => void
): Promise<FounderReport> {
  async function runWithUpdate(
    runFn: (deep: boolean) => Promise<FounderFinding>,
    role: AgentRole
  ): Promise<FounderFinding> {
    onAgentStarted?.(role);
    try {
      const result = await runFn(deep);
      onAgentUpdate(result);
      return result;
    } catch {
      const errorFinding = makeFounderErrorFinding(role);
      onAgentUpdate(errorFinding);
      return errorFinding;
    }
  }

  const results = await Promise.allSettled(
    founderRunners.map(({ role, run }) =>
      runWithUpdate(() => run(input, deep), role)
    )
  );

  const findings: FounderFinding[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled") findings.push(result.value);
  });

  return runFounderSynthesizer(input, findings);
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

export async function runCounterfactual(
  input: CounterfactualInput,
  deep: boolean,
  onAgentUpdate: (finding: CounterfactualAgentFinding) => void,
  onAgentStarted?: (role: AgentRole) => void
): Promise<CounterfactualReport> {
  async function runWithUpdate(
    runFn: (deep: boolean) => Promise<CounterfactualAgentFinding>,
    role: AgentRole
  ): Promise<CounterfactualAgentFinding> {
    onAgentStarted?.(role);
    try {
      const result = await runFn(deep);
      onAgentUpdate(result);
      return result;
    } catch {
      const errorFinding = makeCounterfactualErrorFinding(role);
      onAgentUpdate(errorFinding);
      return errorFinding;
    }
  }

  const results = await Promise.allSettled([
    runWithUpdate(() => runCFMarketAnalyst(input, deep), "market-analyst"),
    runWithUpdate(() => runCFOperator(input, deep), "operator"),
    runWithUpdate(() => runCFMoneyTrail(input, deep), "money-trail"),
    runWithUpdate(() => runCFCustomerVoice(input, deep), "customer-voice"),
    runWithUpdate(() => runCFEngineer(input, deep), "engineer"),
    runWithUpdate(() => runCFHistorian(input, deep), "historian"),
  ]);

  const findings: CounterfactualAgentFinding[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled") findings.push(result.value);
  });

  return runCounterfactualSynthesizer(input, findings);
}
