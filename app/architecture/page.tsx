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
  { name: "POSTMORTEM", color: "#D62828", path: "6 agents → Debate → Synthesizer → Report" },
  { name: "PRE-MORTEM", color: "#FFD60A", path: "6 risk agents → Risk Synthesizer → Report" },
  { name: "FOUNDER MODE", color: "#06D6A0", path: "6 founder agents → Founder Synthesizer → Report" },
  { name: "COUNTERFACTUAL", color: "#FACC15", path: "6 CF agents → CF Synthesizer → Report" },
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
        <rect x={centerX - 120} y={modeY} width={240} height={50} fill="#161616" stroke="#F4F1EA" strokeWidth={2} />
        <text x={centerX} y={modeY + 20} textAnchor="middle" fill="#F4F1EA" fontFamily="monospace" fontSize={11} fontWeight="bold">
          MODE SELECTOR
        </text>
        <text x={centerX} y={modeY + 38} textAnchor="middle" fill="#71706B" fontFamily="monospace" fontSize={8}>
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
              <rect x={bx} y={agentY - 10} width={140} height={30} fill="#161616" stroke={m.color} strokeWidth={1.5} />
              <text x={bx + 70} y={agentY + 10} textAnchor="middle" fill={m.color} fontFamily="monospace" fontSize={9} fontWeight="bold">
                {m.name}
              </text>
              <text x={bx + 70} y={agentY + 50} textAnchor="middle" fill="#71706B" fontFamily="monospace" fontSize={7}>
                {m.path}
              </text>
            </g>
          );
        })}

        {/* 6 parallel agents block */}
        <rect x={centerX - 200} y={agentY + 60} width={400} height={60} fill="#161616" stroke="#D62828" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={centerX} y={agentY + 85} textAnchor="middle" fill="#D62828" fontFamily="monospace" fontSize={11} fontWeight="bold">
          6 PARALLEL AGENTS
        </text>
        <text x={centerX} y={agentY + 105} textAnchor="middle" fill="#71706B" fontFamily="monospace" fontSize={8}>
          Market · Operator · Money · Customer · Engineer · Historian
        </text>

        {/* Arrow to Synthesizer */}
        <motion.line
          x1={centerX} y1={agentY + 120}
          x2={centerX} y2={synthY}
          stroke="#FFD60A" strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 0.3, ease: "linear" }}
        />

        {/* Synthesizer */}
        <rect x={centerX - 120} y={synthY} width={240} height={40} fill="#161616" stroke="#06D6A0" strokeWidth={2} />
        <text x={centerX} y={synthY + 25} textAnchor="middle" fill="#06D6A0" fontFamily="monospace" fontSize={11} fontWeight="bold">
          MODE-SPECIFIC SYNTHESIZER
        </text>

        {/* Arrow to Verdict */}
        <motion.line
          x1={centerX} y1={synthY + 40}
          x2={centerX} y2={verdictY}
          stroke="#06D6A0" strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 0.3, ease: "linear" }}
        />

        {/* Verdict */}
        <rect x={centerX - 140} y={verdictY} width={280} height={50} fill="#161616" stroke="#D62828" strokeWidth={2} />
        <text x={centerX} y={verdictY + 20} textAnchor="middle" fill="#D62828" fontFamily="monospace" fontSize={11} fontWeight="bold">
          VERDICT / REPORT
        </text>
        <text x={centerX} y={verdictY + 38} textAnchor="middle" fill="#71706B" fontFamily="monospace" fontSize={8}>
          Postmortem · Premortem · Founder · Counterfactual
        </text>

        {/* AMD MI300X bottom layer */}
        <rect x={40} y={verdictY + 60} width={720} height={30} fill="#0E0E0E" stroke="#3F3F3F" strokeWidth={1} />
        <text x={400} y={verdictY + 80} textAnchor="middle" fill="#5C5852" fontFamily="monospace" fontSize={9}>
          AMD MI300X — 192GB HBM3 — 5.3 TB/s BANDWIDTH — ALL MODES SHARE THIS LAYER
        </text>
      </svg>
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <main className="min-h-dvh bg-[#0E0E0E] text-[#F4F1EA]">
      {/* Nav */}
      <nav className="border-b border-[#2A2A2A] flex items-center justify-between px-6 py-4 sm:px-12">
        <Link
          href="/"
          className="font-mono text-sm text-[#71706B] transition-colors hover:text-[#F4F1EA]"
        >
          &larr; BACK
        </Link>
        <span className="font-mono text-lg font-bold tracking-wider text-[#D62828]">
          AUTOPSY
        </span>
        <Link
          href="/investigate"
          className="font-mono text-sm border-2 border-[#D62828] text-[#D62828] px-4 py-1.5 hover:bg-[#D62828] hover:text-[#0E0E0E] transition-colors"
        >
          [ LAUNCH &#9656; ]
        </Link>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-12">

        {/* §01 — Hero */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#71706B]">
            &sect;01 &mdash; Execution Architecture
          </span>
          <h1 className="mt-6 font-serif text-4xl sm:text-6xl leading-tight text-[#F4F1EA]">
            4 Modes. 24 Agents. 1 GPU.{" "}
            <span className="text-[#D62828]">Kimi K2.6.</span>
          </h1>
          <p className="mt-8 max-w-2xl font-serif text-base leading-8 text-[#B8B5AE]">
            How Autopsy uses AMD MI300X&apos;s 192GB HBM3 memory to run 24 specialized agents across 4 investigation modes — enabling real-time cross-agent debate that&apos;s impossible on smaller GPUs.
          </p>
        </section>

        {/* §02 — Architecture Diagram */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#71706B]">
            &sect;02 &mdash; Live Architecture
          </span>
          <h2 className="mt-6 mb-8 font-mono text-sm text-[#F4F1EA] uppercase tracking-wider">
            Pipeline: Mode Select &#8594; Parallel Agents &#8594; Synthesis &#8594; Verdict
          </h2>
          <div className="border border-[#2A2A2A] bg-[#161616] p-6">
            <ArchitectureDiagram />
          </div>
        </section>

        {/* §03 — Why AMD MI300X */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#71706B]">
            &sect;03 &mdash; H100 vs MI300X
          </span>
          <h2 className="mt-6 mb-8 font-mono text-sm text-[#F4F1EA] uppercase tracking-wider">
            The hardware advantage that makes debate possible
          </h2>
          <div className="grid gap-0 sm:grid-cols-2">
            <div className="border border-[#2A2A2A] bg-[#161616] p-8">
              <p className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-[#5C5852]">
                ON A SINGLE H100
              </p>
              <p className="mb-6 font-mono text-sm text-[#5C5852]">80GB HBM3</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-[#5C5852]">
                  <span className="font-mono text-[#3F3F3F] mt-0.5">[&mdash;]</span>
                  Cannot hold 6 x 70B agents in memory
                </li>
                <li className="flex items-start gap-3 text-sm text-[#5C5852]">
                  <span className="font-mono text-[#3F3F3F] mt-0.5">[&mdash;]</span>
                  Must run in 3 sequential rounds
                </li>
                <li className="flex items-start gap-3 text-sm text-[#5C5852]">
                  <span className="font-mono text-[#3F3F3F] mt-0.5">[&mdash;]</span>
                  Total time: ~75 seconds
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-[#5C5852]">
                  <span className="font-mono text-[#3F3F3F] mt-0.5">[&mdash;]</span>
                  Lost: real-time agent debate impossible
                </li>
              </ul>
            </div>
            <div className="border-2 border-[#D62828] bg-[#161616] p-8">
              <p className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-[#D62828]">
                ON AMD MI300X
              </p>
              <p className="mb-6 font-mono text-sm text-[#D62828]">192GB HBM3</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-[#F4F1EA]">
                  <span className="font-mono text-[#06D6A0] mt-0.5">[+]</span>
                  All 6 agents loaded simultaneously
                </li>
                <li className="flex items-start gap-3 text-sm text-[#F4F1EA]">
                  <span className="font-mono text-[#06D6A0] mt-0.5">[+]</span>
                  Single parallel pass
                </li>
                <li className="flex items-start gap-3 text-sm text-[#F4F1EA]">
                  <span className="font-mono text-[#06D6A0] mt-0.5">[+]</span>
                  Total time: ~15 seconds
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-[#F4F1EA]">
                  <span className="font-mono text-[#FFD60A] mt-0.5">[*]</span>
                  Enabled: real-time agent debate, cross-rebuttal
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* §04 — Performance Stats */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#71706B]">
            &sect;04 &mdash; By The Numbers
          </span>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.25, ease: "linear" }}
                className="border-2 border-[#3F3F3F] bg-[#161616] p-4 text-center"
              >
                <span className="font-mono text-2xl font-bold text-[#D62828]">
                  {stat.value}
                </span>
                <span className="font-mono text-sm text-[#71706B]">
                  {stat.unit}
                </span>
                <p className="mt-2 font-mono text-[8px] uppercase tracking-wider text-[#71706B]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* §05 — Counterfactual Architecture */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FACC15]">
            &sect;05 &mdash; Counterfactual Architecture
          </span>
          <h2 className="mt-6 mb-4 font-serif text-2xl sm:text-3xl text-[#F4F1EA]">
            Reasoning about what <span className="text-[#FACC15]">didn&apos;t</span> happen
          </h2>
          <p className="mb-8 max-w-2xl text-sm leading-7 text-[#B8B5AE]">
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
                className="border border-[#FACC15]/20 bg-[#161616] p-5"
              >
                <span className="font-mono text-xs text-[#FACC15]">{step.num}</span>
                <h3 className="mt-2 font-mono text-sm font-bold uppercase tracking-wider text-[#F4F1EA]">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#B8B5AE]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* §06 — Tech Stack */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#71706B]">
            &sect;06 &mdash; Tech Stack
          </span>
          <div className="mt-6 border-t border-[#2A2A2A]">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="border-b border-[#2A2A2A] py-4 flex items-baseline justify-between gap-4"
              >
                <span className="font-mono text-sm text-[#F4F1EA]">
                  {tech.name}
                </span>
                <span className="font-mono text-xs text-[#71706B] text-right">
                  {tech.detail}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* §07 — Open Source Note */}
        <section className="mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#71706B]">
            &sect;07 &mdash; Open Source
          </span>
          <div className="mt-6 border-2 border-[#FFD60A] bg-[#161616] p-8">
            <p className="mb-6 font-serif text-lg leading-8 text-[#B8B5AE]">
              Autopsy is open source. The agent prompts, orchestration logic, and debate methodology are all public. We believe better agent systems come from shared methodology, not closed walls.
            </p>
            <a
              href="https://github.com/anilandcode/autopsy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 bg-[#FFD60A] px-5 text-sm font-bold font-mono text-[#0E0E0E] transition-colors hover:bg-[#E6C000]"
            >
              [ VIEW ON GITHUB ]
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2A2A2A] px-6 py-8 sm:px-12">
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <span className="font-mono text-xs text-[#71706B]">
            AUTOPSY / 2026 / OPEN SOURCE
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#5C5852]">
            MODES:
            <span className="text-[#D62828]">POSTMORTEM</span> /
            <span className="text-[#FFD60A]">PRE-MORTEM</span> /
            <span className="text-[#06D6A0]">FOUNDER</span> /
            <span className="text-[#FACC15]">COUNTERFACTUAL</span>
          </span>
          <span className="font-mono text-xs text-[#71706B]">
            Built for AMD Developer Hackathon 2026
          </span>
        </div>
      </footer>
    </main>
  );
}
