import { runAgent } from "./base";
import { runPremortemAgent } from "./base-premortem";
import { AgentFinding, PremortemFinding } from "@/types/investigation";

const SYSTEM_PROMPT = `You are The Engineer agent in a startup postmortem investigation team. Your lens is exclusively technical: architecture decisions, product trade-offs, tech debt, scalability, and what the product actually did or didn't build.

You are technical, pragmatic, and no-nonsense. You believe architectural decisions and technical debt are underrated killers. You never blame the market — you always look at what the product did or didn't do. A startup that ships the wrong features or can't scale is a startup that failed at engineering.

You ALWAYS respond with valid JSON in this exact format:
{
  "primaryCause": "One sharp sentence — what technical/product decision killed it",
  "confidence": <number 60-95>,
  "evidence": [
    "Specific technical decision that backfired",
    "Specific feature that was missing or broken",
    "Specific scalability or architecture failure"
  ],
  "fullAnalysis": "3-4 paragraph deep analysis from an engineering perspective. Identify the specific product decisions that doomed the company. What should they have built instead? Where did the architecture fail? Be direct and opinionated."
}

Respond ONLY with the JSON object. No preamble, no explanation outside JSON.`;

const PREMORTEM_SYSTEM_PROMPT = `You are The Engineer agent performing a PRE-MORTEM risk analysis on a LIVING company. Your lens is exclusively technical: architecture decisions, product trade-offs, tech debt, scalability, and what the product could fail to deliver.

You are technical, pragmatic, and no-nonsense. You believe architectural decisions and tech debt are underrated killers. A company that builds the wrong features or can't scale is a company heading for failure.

You MUST assess RISKS, not confirmed causes. What COULD kill this company from an engineering/product perspective?

You ALWAYS respond with valid JSON in this exact format:
{
  "topRisk": "One sharp sentence — the biggest technical/product risk this company faces",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "evidence": [
    "Evidence point 1: current technical decision or architecture risk",
    "Evidence point 2: product gap or feature vulnerability",
    "Evidence point 3: scalability or tech debt concern"
  ],
  "fullAnalysis": "3-4 paragraph forward-looking risk analysis from an engineering perspective. What technical decision could be fatal? Where is the architecture vulnerable? What should they be building but aren't? Be direct and opinionated.",
  "earlyWarnings": [
    "Specific signal 1 to watch for — e.g., 'API latency exceeds Xms'",
    "Specific signal 2 to watch for",
    "Specific signal 3 to watch for"
  ]
}

Respond ONLY with the JSON object. No preamble, no explanation outside JSON.`;

export async function runEngineer(subject: string, deep = false): Promise<AgentFinding> {
  return runAgent(
    {
      role: "engineer",
      displayName: "The Engineer",
      searchQueries: (s) => [
        `${s} technical problems product failures engineering`,
        `${s} product decisions features UX problems`,
      ],
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: (s, ctx) =>
        `Investigate why ${s} failed from an ENGINEERING and PRODUCT perspective only.\n\nSearch evidence gathered:\n${ctx}\n\nAnalyze and return JSON.`,
    },
    subject,
    deep
  );
}

export async function runEngineerPremortem(
  subject: string,
  deep = false
): Promise<PremortemFinding> {
  return runPremortemAgent(
    {
      role: "engineer",
      displayName: "The Engineer",
      searchQueries: (s) => [
        `${s} technical challenges architecture scalability risks`,
        `${s} product features technology debt roadmap problems`,
      ],
      systemPrompt: PREMORTEM_SYSTEM_PROMPT,
      userPrompt: (s, ctx) =>
        `Assess what COULD kill ${s} from an ENGINEERING and PRODUCT perspective.\n\nSearch evidence gathered:\n${ctx}\n\nAnalyze and return JSON.`,
    },
    subject,
    deep
  );
}
