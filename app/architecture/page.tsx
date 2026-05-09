"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const AGENTS = [
  { name: "Market Analyst", role: "market-analyst", model: "Kimi K2.6", mem: "~28 GB" },
  { name: "The Operator", role: "operator", model: "Kimi K2.6", mem: "~28 GB" },
  { name: "Money Trail", role: "money-trail", model: "Kimi K2.6", mem: "~28 GB" },
  { name: "Customer Voice", role: "customer-voice", model: "Kimi K2.6", mem: "~28 GB" },
  { name: "The Engineer", role: "engineer", model: "Kimi K2.6", mem: "~28 GB" },
  { name: "The Historian", role: "historian", model: "Kimi K2.6", mem: "~28 GB" },
];

const MODES = [
  { name: "POSTMORTEM", color: "#4B4BA0", path: "6 agents → Debate → Synthesizer → Report" },
  { name: "PRE-MORTEM", color: "#8F47AE", path: "6 risk agents → Risk Synthesizer → Report" },
  { name: "FOUNDER MODE", color: "#00A67E", path: "6 founder agents → Founder Synthesizer → Report" },
  { name: "COUNTERFACTUAL", color: "#8F47AE", path: "6 CF agents → CF Synthesizer → Report" },
];

const STATS = [
  { value: "4", unit: "", label: "Investigation Modes" },
  { value: "24", unit: "", label: "Specialized Agents" },
  { value: "192", unit: "GB", label: "HBM3 Memory" },
  { value: "262", unit: "K", label: "Token Context Window" },
  { value: "5.3", unit: "TB/s", label: "Memory Bandwidth" },
  { value: "0.7", unit: "s", label: "Time to First Token" },
  { value: "1", unit: "T", label: "Params / Agent" },
  { value: "30", unit: "", label: "Historical Cases in DB" },
];

const TECH_STACK = [
  { name: "Next.js 15", detail: "App Router + Turbopack" },
  { name: "TypeScript 5.x", detail: "Full type safety" },
  { name: "Tailwind v4", detail: "Utility-first CSS" },
  { name: "Framer Motion", detail: "Animation primitives" },
  { name: "Kimi K2.6 (1T params, 262K context)", detail: "Moonshot AI via Fireworks" },
  { name: "Tavily Search API", detail: "Real-time web research" },
  { name: "Server-Sent Events", detail: "Streaming agent updates" },
  { name: "Vercel", detail: "Edge deployment" },
];

function ArchitectureDiagram() {
  const modeY = 30;
  const agentY = 140;
  const synthY = 280;
  const verdictY = 360;
  const centerX = 400;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 800 440" className="mx-auto w-full max-w-4xl" style={{ minWidth: 600 }}>
        {/* Mode Selector */}
        <rect x={centerX - 120} y={modeY} width={240} height={50} fill="#0F1110" stroke="white" strokeWidth={2} />
        <text x={centerX} y={modeY + 20} textAnchor="middle" fill="white" fontFamily="monospace" fontSize={11} fontWeight="bold">
          MODE SELECTOR
        </text>
        <text x={centerX} y={modeY + 38} textAnchor="middle" fill="#A1A1AA" fontFamily="monospace" fontSize={8}>
          4 modes — 24 agents total
        </text>

        {/* Mode branches */}
        {MODES.map((m, i) => {
          const bx = 80 + i * 185;
          const by = modeY + 50 + 10;
          return (
            <g key={m.name}>
              <motion.line
                x1={centerX} y1={modeY + 50}
                x2={bx + 70} y2={agentY - 10}
                stroke={m.color} strokeWidth={1.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.4, ease: "linear" }}
              />
              <rect x={bx} y={agentY - 10} width={140} height={30} fill="#0F1110" stroke={m.color} strokeWidth={1.5} />
              <text x={bx + 70} y={agentY + 10} textAnchor="middle" fill={m.color} fontFamily="monospace" fontSize={9} fontWeight="bold">
                {m.name}
              </text>
              <text x={bx + 70} y={agentY + 50} textAnchor="middle" fill="#A1A1AA" fontFamily="monospace" fontSize={7}>
                {m.path}
              </text>
            </g>
          );
        })}

        {/* 6 parallel agents block */}
        <rect x={centerX - 200} y={agentY + 60} width={400} height={60} fill="#0F1110" stroke="#4B4BA0" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={centerX} y={agentY + 85} textAnchor="middle" fill="#4B4BA0" fontFamily="monospace" fontSize={11} fontWeight="bold">
          6 PARALLEL AGENTS
        </text>
        <text x={centerX} y={agentY + 105} textAnchor="middle" fill="#A1A1AA" fontFamily="monospace" fontSize={8}>
          Market · Operator · Money · Customer · Engineer · Historian
        </text>

        {/* Arrow to Synthesizer */}
        <motion.line
          x1={centerX} y1={agentY + 120}
          x2={centerX} y2={synthY}
          stroke="#8F47AE" strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 0.3, ease: "linear" }}
        />

        {/* Synthesizer */}
        <rect x={centerX - 120} y={synthY} width={240} height={40} fill="#0F1110" stroke="#00A67E" strokeWidth={2} />
        <text x={centerX} y={synthY + 25} textAnchor="middle" fill="#00A67E" fontFamily="monospace" fontSize={11} fontWeight="bold">
          MODE-SPECIFIC SYNTHESIZER
        </text>

        {/* Arrow to Verdict */}
        <motion.line
          x1={centerX} y1={synthY + 40}
          x2={centerX} y2={verdictY}
          stroke="#00A67E" strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 0.3, ease: "linear" }}
        />

        {/* Verdict */}
        <rect x={centerX - 140} y={verdictY} width={280} height={50} fill="#0F1110" stroke="#4B4BA0" strokeWidth={2} />
        <text x={centerX} y={verdictY + 20} textAnchor="middle" fill="#4B4BA0" fontFamily="monospace" fontSize={11} fontWeight="bold">
          VERDICT / REPORT
        </text>
        <text x={centerX} y={verdictY + 38} textAnchor="middle" fill="#A1A1AA" fontFamily="monospace" fontSize={8}>
          Postmortem · Premortem · Founder · Counterfactual
        </text>

        {/* AMD MI300X bottom layer */}
        <rect x={40} y={verdictY + 60} width={720} height={30} fill="#0F1110" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <text x={400} y={verdictY + 80} textAnchor="middle" fill="#A1A1AA" fontFamily="monospace" fontSize={9}>
          AMD MI300X — 192GB HBM3 — 5.3 TB/s BANDWIDTH — ALL MODES SHARE THIS LAYER
        </text>
      </svg>
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <main className="min-h-dvh bg-[#0F1110] text-[white]">
      {/* Nav */}
      <nav className="border-b border-[rgba(255,255,255,0.1)] flex items-center px-6 py-4 sm:px-12">
        <Link
          href="/"
          className="font-mono text-sm text-[#A1A1AA] transition-colors hover:text-[white]"
        >
          &larr; BACK
        </Link>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-12">

        {/* §01 — Hero */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            &sect;01 &mdash; Execution Architecture
          </span>
          <h1 className="mt-6 font-serif text-4xl sm:text-6xl leading-tight text-[white]">
            4 Modes. 24 Agents. 1 GPU.{" "}
            <span className="text-[#4B4BA0]">Kimi K2.6.</span>
          </h1>
          <p className="mt-8 max-w-2xl font-serif text-base leading-8 text-[#A1A1AA]">
            How Autopsy uses AMD MI300X&apos;s 192GB HBM3 memory to run 24 specialized agents across 4 investigation modes — enabling real-time cross-agent debate that&apos;s impossible on smaller GPUs.
          </p>
        </section>

        {/* §02 — Architecture Diagram */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            &sect;02 &mdash; Live Architecture
          </span>
          <h2 className="mt-6 mb-8 font-mono text-sm text-[white] uppercase tracking-wider">
            Pipeline: Mode Select &#8594; Parallel Agents &#8594; Synthesis &#8594; Verdict
          </h2>
          <div className="border border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-6">
            <ArchitectureDiagram />
          </div>
        </section>

        {/* §03 — Why AMD MI300X */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            &sect;03 &mdash; H100 vs MI300X
          </span>
          <h2 className="mt-6 mb-8 font-mono text-sm text-[white] uppercase tracking-wider">
            The hardware advantage that makes debate possible
          </h2>
          <div className="grid gap-0 sm:grid-cols-2">
            <div className="border border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-8">
              <p className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                ON A SINGLE H100
              </p>
              <p className="mb-6 font-mono text-sm text-[#A1A1AA]">80GB HBM3</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-[#A1A1AA]">
                  <span className="font-mono text-[rgba(255,255,255,0.1)] mt-0.5">[&mdash;]</span>
                  Cannot hold 6 x 70B agents in memory
                </li>
                <li className="flex items-start gap-3 text-sm text-[#A1A1AA]">
                  <span className="font-mono text-[rgba(255,255,255,0.1)] mt-0.5">[&mdash;]</span>
                  Must run in 3 sequential rounds
                </li>
                <li className="flex items-start gap-3 text-sm text-[#A1A1AA]">
                  <span className="font-mono text-[rgba(255,255,255,0.1)] mt-0.5">[&mdash;]</span>
                  Total time: ~75 seconds
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-[#A1A1AA]">
                  <span className="font-mono text-[rgba(255,255,255,0.1)] mt-0.5">[&mdash;]</span>
                  Lost: real-time agent debate impossible
                </li>
              </ul>
            </div>
            <div className="border-2 border-[#4B4BA0] bg-[#0F1110] p-8">
              <p className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-[#4B4BA0]">
                ON AMD MI300X
              </p>
              <p className="mb-6 font-mono text-sm text-[#4B4BA0]">192GB HBM3</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-[white]">
                  <span className="font-mono text-[#00A67E] mt-0.5">[+]</span>
                  All 6 agents loaded simultaneously
                </li>
                <li className="flex items-start gap-3 text-sm text-[white]">
                  <span className="font-mono text-[#00A67E] mt-0.5">[+]</span>
                  Single parallel pass
                </li>
                <li className="flex items-start gap-3 text-sm text-[white]">
                  <span className="font-mono text-[#00A67E] mt-0.5">[+]</span>
                  Total time: ~15 seconds
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-[white]">
                  <span className="font-mono text-[#8F47AE] mt-0.5">[*]</span>
                  Enabled: real-time agent debate, cross-rebuttal
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* §04 — Performance Stats */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            &sect;04 &mdash; By The Numbers
          </span>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.25, ease: "linear" }}
                className="border-2 border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-4 text-center"
              >
                <span className="font-mono text-2xl font-bold text-[#4B4BA0]">
                  {stat.value}
                </span>
                <span className="font-mono text-sm text-[#A1A1AA]">
                  {stat.unit}
                </span>
                <p className="mt-2 font-mono text-[8px] uppercase tracking-wider text-[#A1A1AA]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* §05 — Counterfactual Architecture */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#8F47AE]">
            &sect;05 &mdash; Counterfactual Architecture
          </span>
          <h2 className="mt-6 mb-4 font-serif text-2xl sm:text-3xl text-[white]">
            Reasoning about what <span className="text-[#8F47AE]">didn&apos;t</span> happen
          </h2>
          <p className="mb-8 max-w-2xl text-sm leading-7 text-[#A1A1AA]">
            Standard agents analyze what happened. Counterfactual agents must reason about what DIDN&apos;T happen. This requires agents to:
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { num: "01", title: "Understand the actual causal chain", desc: "Each agent maps what actually led to failure before reasoning about alternatives." },
              { num: "02", title: "Identify the decision point", desc: "Pinpoint the specific decision that created the divergence between actual and alternate timelines." },
              { num: "03", title: "Model the alternate causal chain", desc: "Build a plausible alternate timeline from the decision point forward, grounded in evidence." },
              { num: "04", title: "Find historical precedents", desc: "Search for real companies that made the alternate decision. Their outcomes become evidence." },
              { num: "05", title: "Assess second and third-order consequences", desc: "Butterfly effects — the alternate decision creates cascading changes beyond the obvious." },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border border-[#8F47AE]/20 bg-[#0F1110] p-5"
              >
                <span className="font-mono text-xs text-[#8F47AE]">{step.num}</span>
                <h3 className="mt-2 font-mono text-sm font-bold uppercase tracking-wider text-[white]">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#A1A1AA]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* §06 — Active Model */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#4B4BA0]">
            &sect;06 &mdash; Active Model
          </span>
          <div className="mt-6 border border-[rgba(255,255,255,0.1)] bg-[#0F1110] p-6">
            <p className="font-mono text-xs text-[#A1A1AA]">Currently running</p>
            <p className="mt-2 text-xl text-[white]" style={{ fontFamily: "var(--font-serif), Georgia, serif" }}>
              {process.env.NEXT_PUBLIC_LLM_MODEL || "accounts/fireworks/models/kimi-k2p6"}
            </p>
            <p className="mt-2 font-mono text-xs text-[#A1A1AA]">
              Configure via LLM_MODEL in .env.local — see model options there.
            </p>
          </div>
        </section>

        {/* §07 — Tech Stack */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            &sect;07 &mdash; Tech Stack
          </span>
          <div className="mt-6 border-t border-[rgba(255,255,255,0.1)]">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="border-b border-[rgba(255,255,255,0.1)] py-4 flex items-baseline justify-between gap-4"
              >
                <span className="font-mono text-sm text-[white]">
                  {tech.name}
                </span>
                <span className="font-mono text-xs text-[#A1A1AA] text-right">
                  {tech.detail}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* §07 — Open Source Note */}
        <section className="mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            &sect;08 &mdash; Open Source
          </span>
          <div className="mt-6 border-2 border-[#8F47AE] bg-[#0F1110] p-8">
            <p className="mb-6 font-serif text-lg leading-8 text-[#A1A1AA]">
              Autopsy is open source. The agent prompts, orchestration logic, and debate methodology are all public. We believe better agent systems come from shared methodology, not closed walls.
            </p>
            <a
              href="https://github.com/anilandcode/autopsy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 bg-[#8F47AE] px-5 text-sm font-bold font-mono text-[#0F1110] transition-colors hover:bg-[#E6C000]"
            >
              [ VIEW ON GITHUB ]
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.1)] px-6 py-8 sm:px-12">
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <span className="font-mono text-xs text-[#A1A1AA]">
            AUTOPSY / 2026 / OPEN SOURCE
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#A1A1AA]">
            MODES:
            <span className="text-[#4B4BA0]">POSTMORTEM</span> /
            <span className="text-[#8F47AE]">PRE-MORTEM</span> /
            <span className="text-[#00A67E]">FOUNDER</span> /
            <span className="text-[#8F47AE]">COUNTERFACTUAL</span>
          </span>
          <span className="font-mono text-xs text-[#A1A1AA]">
            Built for AMD Developer Hackathon 2026
          </span>
        </div>
      </footer>
    </main>
  );
}
