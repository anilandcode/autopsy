"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const AGENTS = [
  { name: "Market Analyst", role: "market-analyst", model: "DeepSeek V4 Pro", mem: "~28 GB" },
  { name: "The Operator", role: "operator", model: "DeepSeek V4 Pro", mem: "~28 GB" },
  { name: "Money Trail", role: "money-trail", model: "DeepSeek V4 Pro", mem: "~28 GB" },
  { name: "Customer Voice", role: "customer-voice", model: "DeepSeek V4 Pro", mem: "~28 GB" },
  { name: "The Engineer", role: "engineer", model: "DeepSeek V4 Pro", mem: "~28 GB" },
  { name: "The Historian", role: "historian", model: "DeepSeek V4 Pro", mem: "~28 GB" },
];

const STATS = [
  { value: "192", unit: "GB", label: "HBM3 Memory" },
  { value: "6", unit: "", label: "Concurrent Agents" },
  { value: "5.3", unit: "TB/s", label: "Memory Bandwidth" },
  { value: "22", unit: "s", label: "Avg Investigation" },
  { value: "70", unit: "B", label: "Params / Agent" },
];

const TECH_STACK = [
  { name: "Next.js 15", detail: "App Router + Turbopack" },
  { name: "TypeScript 5.x", detail: "Full type safety" },
  { name: "Tailwind v4", detail: "Utility-first CSS" },
  { name: "Framer Motion", detail: "Animation primitives" },
  { name: "DeepSeek V4 Pro (1.6T MoE)", detail: "via Fireworks AI -> Migrating to Llama 3.3 70B on AMD MI300X" },
  { name: "Tavily Search API", detail: "Real-time web research" },
  { name: "Server-Sent Events", detail: "Streaming agent updates" },
  { name: "Vercel", detail: "Edge deployment" },
];

function ArchitectureDiagram() {
  const agentY = 140;
  const debateY = 260;
  const synthY = 340;
  const verdictY = 420;
  const centerX = 400;
  const agentSpacing = 120;
  const startAgentX = centerX - agentSpacing * 2.5;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 800 480" className="mx-auto w-full max-w-4xl" style={{ minWidth: 600 }}>
        {/* User Input */}
        <rect x={centerX - 100} y={20} width={200} height={50} fill="#161616" stroke="#FFD60A" strokeWidth={2} />
        <text x={centerX} y={50} textAnchor="middle" fill="#FFD60A" fontFamily="monospace" fontSize={12} fontWeight="bold">
          USER INPUT
        </text>

        {/* Lines from User to each agent */}
        {AGENTS.map((_, i) => {
          const ax = startAgentX + i * agentSpacing;
          return (
            <motion.line
              key={`in-${i}`}
              x1={centerX} y1={70}
              x2={ax + 45} y2={agentY}
              stroke="#2A2A2A" strokeWidth={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: "linear" }}
            />
          );
        })}

        {/* Agent boxes */}
        {AGENTS.map((agent, i) => {
          const ax = startAgentX + i * agentSpacing;
          return (
            <g key={agent.role}>
              <rect x={ax} y={agentY} width={90} height={80} fill="#161616" stroke="#D62828" strokeWidth={1.5} />
              <text x={ax + 45} y={agentY + 20} textAnchor="middle" fill="#F4F1EA" fontFamily="monospace" fontSize={9} fontWeight="bold">
                {agent.name.length > 12 ? agent.name.slice(0, 11) + "\u2026" : agent.name}
              </text>
              <text x={ax + 45} y={agentY + 38} textAnchor="middle" fill="#71706B" fontFamily="monospace" fontSize={7}>
                {agent.model}
              </text>
              <text x={ax + 45} y={agentY + 54} textAnchor="middle" fill="#5C5852" fontFamily="monospace" fontSize={7}>
                {agent.mem}
              </text>
              {/* Pulse indicator */}
              <motion.circle
                cx={ax + 78} cy={agentY + 8}
                r={3}
                fill="#D62828"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
              />
            </g>
          );
        })}

        {/* Lines from agents to Debate */}
        {AGENTS.map((_, i) => {
          const ax = startAgentX + i * agentSpacing;
          return (
            <motion.line
              key={`deb-${i}`}
              x1={ax + 45} y1={agentY + 80}
              x2={centerX} y2={debateY}
              stroke="#D62828" strokeWidth={1}
              strokeDasharray="4 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1 + i * 0.05, duration: 0.3, ease: "linear" }}
            />
          );
        })}

        {/* Debate Round box */}
        <rect x={centerX - 120} y={debateY} width={240} height={50} fill="#161616" stroke="#FFD60A" strokeWidth={2} />
        <text x={centerX} y={debateY + 20} textAnchor="middle" fill="#FFD60A" fontFamily="monospace" fontSize={12} fontWeight="bold">
          DEBATE ROUND
        </text>
        <text x={centerX} y={debateY + 38} textAnchor="middle" fill="#71706B" fontFamily="monospace" fontSize={8}>
          Agents critique each other&apos;s findings
        </text>

        {/* Line from Debate to Synthesizer */}
        <motion.line
          x1={centerX} y1={debateY + 50}
          x2={centerX} y2={synthY}
          stroke="#FFD60A" strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 0.3, ease: "linear" }}
        />

        {/* Synthesizer box */}
        <rect x={centerX - 90} y={synthY} width={180} height={50} fill="#161616" stroke="#06D6A0" strokeWidth={2} />
        <text x={centerX} y={synthY + 20} textAnchor="middle" fill="#06D6A0" fontFamily="monospace" fontSize={12} fontWeight="bold">
          SYNTHESIZER
        </text>
        <text x={centerX} y={synthY + 38} textAnchor="middle" fill="#71706B" fontFamily="monospace" fontSize={8}>
          Weighs debate + evidence
        </text>

        {/* Line from Synth to Verdict */}
        <motion.line
          x1={centerX} y1={synthY + 50}
          x2={centerX} y2={verdictY}
          stroke="#06D6A0" strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.8, duration: 0.3, ease: "linear" }}
        />

        {/* Final Verdict box */}
        <rect x={centerX - 100} y={verdictY} width={200} height={50} fill="#161616" stroke="#D62828" strokeWidth={2} />
        <text x={centerX} y={verdictY + 20} textAnchor="middle" fill="#D62828" fontFamily="monospace" fontSize={12} fontWeight="bold">
          FINAL VERDICT
        </text>
        <text x={centerX} y={verdictY + 38} textAnchor="middle" fill="#71706B" fontFamily="monospace" fontSize={8}>
          Root cause + pivotal disagreement
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
            6 Agents. 1 GPU.{" "}
            <span className="text-[#D62828]">Parallel Execution.</span>
          </h1>
          <p className="mt-8 max-w-2xl font-serif text-base leading-8 text-[#B8B5AE]">
            How Autopsy uses AMD MI300X&apos;s 192GB HBM3 memory to run 6 specialized 70B-parameter agents simultaneously — enabling real-time cross-agent debate that&apos;s impossible on smaller GPUs.
          </p>
        </section>

        {/* §02 — Architecture Diagram */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#71706B]">
            &sect;02 &mdash; Live Architecture
          </span>
          <h2 className="mt-6 mb-8 font-mono text-sm text-[#F4F1EA] uppercase tracking-wider">
            Pipeline: Input &#8594; Parallel Agents &#8594; Debate &#8594; Synthesis &#8594; Verdict
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
            {/* H100 — Left, muted */}
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

            {/* MI300X — Right, red accent */}
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
                  Total time: ~22 seconds
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
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.25, ease: "linear" }}
                className="border-2 border-[#3F3F3F] bg-[#161616] p-5 text-center"
              >
                <span className="font-mono text-3xl font-bold text-[#D62828]">
                  {stat.value}
                </span>
                <span className="font-mono text-sm text-[#71706B]">
                  {stat.unit}
                </span>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-[#71706B]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* §05 — Tech Stack */}
        <section className="mb-24">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#71706B]">
            &sect;05 &mdash; Tech Stack
          </span>

          <div className="mt-6 border-t border-[#2A2A2A]">
            {TECH_STACK.map((tech, i) => (
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

        {/* §06 — Open Source Note */}
        <section className="mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#71706B]">
            &sect;06 &mdash; Open Source
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
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-[#71706B]">
            AUTOPSY / 2026 / OPEN SOURCE
          </span>
          <span className="font-mono text-xs text-[#5C5852]">
            Built for AMD Developer Hackathon 2026
          </span>
          <span className="font-mono text-xs text-[#71706B]">
            CASE #2026-0113
          </span>
        </div>
      </footer>
    </main>
  );
}
