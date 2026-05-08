export type AgentRole =
  | "market-analyst"
  | "operator"
  | "money-trail"
  | "customer-voice"
  | "engineer"
  | "historian"
  | "synthesizer";

export type AgentStatus = "idle" | "researching" | "analyzing" | "done" | "error";

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
  whatWouldHaveSavedIt: string[];
  lessonsForBuilders: string[];
  generatedAt: string;
}
