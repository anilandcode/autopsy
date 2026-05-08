export type AgentRole =
  | "market-analyst"
  | "operator"
  | "money-trail"
  | "customer-voice"
  | "engineer"
  | "historian"
  | "synthesizer";

export type AgentStatus = "idle" | "researching" | "analyzing" | "done" | "error";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type InvestigationMode = "postmortem" | "premortem" | "founder";

export interface AgentFinding {
  role: AgentRole;
  displayName: string;
  status: AgentStatus;
  primaryCause: string;
  evidence: string[];
  confidence: number;
  fullAnalysis: string;
  sources: { title: string; url: string }[];
}

export interface PremortemFinding {
  role: AgentRole;
  displayName: string;
  status: AgentStatus;
  topRisk: string;
  riskLevel: RiskLevel;
  evidence: string[];
  fullAnalysis: string;
  earlyWarnings: string[];
  sources: { title: string; url: string }[];
}

export interface FounderFinding {
  role: AgentRole;
  displayName: string;
  status: AgentStatus;
  topFailureMode: string;
  severity: RiskLevel;
  evidence: string[];
  fullAnalysis: string;
  mitigations: string[];
  sources: { title: string; url: string }[];
}

export interface FounderModeInput {
  name: string;
  description: string;
  stage: string;
  targetCustomer?: string;
}

export interface AgentDebateOutput {
  agentRole: AgentRole;
  disagreesWith: AgentRole;
  disagreementReason: string;
  agreesWith: AgentRole;
  agreementReason: string;
}

export interface ConsequentialDisagreement {
  agentA: AgentRole;
  agentB: AgentRole;
  topic: string;
  whoseRightAndWhy: string;
}

export interface Disagreement {
  agentA: AgentRole;
  agentB: AgentRole;
  topic: string;
  agentAPosition: string;
  agentBPosition: string;
}

export interface PostmortemReport {
  subject: string;
  executiveSummary: string;
  primaryCauseOfDeath: string;
  confidenceScore: number;
  agentFindings: AgentFinding[];
  disagreements: Disagreement[];
  debateRound: AgentDebateOutput[];
  mostConsequentialDisagreement: ConsequentialDisagreement | null;
  whatWouldHaveSavedIt: string[];
  lessonsForBuilders: string[];
  generatedAt: string;
}

export interface PremortemReport {
  subject: string;
  overallRiskScore: number;
  topThreatToSurvival: string;
  riskCategories: string;
  earlyWarningSystem: string[];
  defensiveActions: string[];
  agentFindings: PremortemFinding[];
  generatedAt: string;
}

export interface FounderReport {
  ideaName: string;
  viabilityScore: number;
  topFailureModes: string[];
  redFlags: string[];
  greenFlags: string[];
  criticalDecisions: string[];
  founderHomework: string[];
  similarSuccesses: string[];
  similarFailures: string[];
  agentFindings: FounderFinding[];
  generatedAt: string;
}
