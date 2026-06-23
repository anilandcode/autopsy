# ROLE_ALIGNMENT — Autopsy

Six specialized agents (historian, operator, money-trail, market-analyst, customer-voice,
engineer) investigate why a company failed, debate, and a synthesizer ships a cited forensic
verdict. The hard part isn't running agents — it's keeping the final verdict honest.

## Forward Deployed AI Engineer ★ (Palantir, Scale AI, OpenAI)
- **Multi-agent orchestration** (debate + synthesis) plus the rare artifact: **agent-output
  evals**. `npm run evals` scores whether the synthesized verdict stays grounded in the agents'
  findings (consistency) — the failure mode of multi-agent systems, measured rather than assumed.

## AI Product Engineer (Productboard, Databricks)
- Full-stack Next.js + a structured agent pipeline (`lib/agents/*`); a verdict is a typed,
  testable artifact, not free text.

## AI Solutions Architect (OpenAI, Deloitte, AWS)
- A pattern for governing probabilistic multi-agent output: synthesize, then verify the
  synthesis against the evidence the agents gathered.

## Proof
- `npm run evals` → `EVAL_SUMMARY.md` (verdict-consistency over recorded investigations; catches
  a verdict that drifts beyond the findings). Mirrors github.com/anilandcode/litmus.
