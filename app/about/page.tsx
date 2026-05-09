"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const agents = [
  {
    num: "01",
    name: "Market Analyst",
    methodology:
      "Searches for market timing, competitive dynamics, demand signals, and TAM/SAM misalignments.",
    bias: "Tends to over-weight timing and under-weight execution quality.",
  },
  {
    num: "02",
    name: "The Operator",
    methodology:
      "Investigates team decisions, hiring patterns, pivots that didn't happen, and execution velocity.",
    bias: "Often blames leadership before acknowledging market headwinds.",
  },
  {
    num: "03",
    name: "Money Trail",
    methodology:
      "Traces burn rate, funding history, unit economics, runway math, and business model viability.",
    bias: "Will flag broken unit economics even when traction is strong.",
  },
  {
    num: "04",
    name: "Customer Voice",
    methodology:
      "Scrapes reviews, Reddit threads, social sentiment, and churn signals.",
    bias: "Can overweight early-adopter complaints and miss mainstream adoption.",
  },
  {
    num: "05",
    name: "The Engineer",
    methodology:
      "Analyzes technical architecture, scalability decisions, product trade-offs, and tech debt accumulation.",
    bias: 'Frequently concludes "the tech was fine, the market was wrong."',
  },
  {
    num: "06",
    name: "The Historian",
    methodology:
      "Pattern-matches against historical failures with similar DNA. Draws from case studies and longitudinal data.",
    bias: "May over-fit to historical analogies and miss novel category risks.",
  },
];

const techStack = [
  { name: "Next.js 15", description: "App Router + Turbopack" },
  { name: "DeepSeek V4 Pro 1.6T MoE", description: "via Fireworks AI" },
  { name: "AMD MI300X", description: "192GB HBM3 — planned migration" },
  { name: "Tavily", description: "Real-time web search" },
  { name: "Server-Sent Events", description: "Streaming agent updates" },
  { name: "Vercel", description: "Edge deployment" },
];

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-[#0F1110] text-[white]">
      {/* Nav */}
      <nav className="border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between px-6 py-4 sm:px-12">
        <Link
          href="/"
          className="font-mono text-sm text-[#A1A1AA] transition-colors hover:text-[white]"
        >
          &larr; BACK
        </Link>
        <span className="font-mono text-lg font-bold tracking-wider text-[#4B4BA0]">
          AUTOPSY
        </span>
        <Link
          href="/investigate"
          className="font-mono text-sm border-2 border-[#4B4BA0] text-[#4B4BA0] px-4 py-1.5 hover:bg-[#4B4BA0] hover:text-[#0F1110] transition-colors"
        >
          [ LAUNCH &#9656; ]
        </Link>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-12">
        {/* Page Header */}
        <h1 className="mb-20 text-5xl sm:text-7xl font-serif text-[white] tracking-tight">
          ABOUT THIS INVESTIGATION
        </h1>

        {/* §01 — WHAT IS AUTOPSY? */}
        <motion.section
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            &sect;01 &mdash; WHAT IS AUTOPSY?
          </span>

          <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Main content — 70% */}
            <div className="lg:w-[70%] space-y-6 font-serif text-base leading-8 text-[#A1A1AA]">
              <p>
                Autopsy is a forensic AI tool that investigates why startups, products, and companies failed.
                Instead of a single chatbot guessing at a postmortem, Autopsy deploys six specialist agents
                — each with a distinct investigative lens — who research in parallel, debate their findings,
                and produce a synthesized verdict backed by live web sources.
              </p>
              <p>
                The result is not an opinion. It is a structured forensic report with a primary cause of
                death, an evidence trail, counterfactual analysis (what would have saved it), and actionable
                lessons for builders. Every claim is sourced. Every agent has a known bias. The disagreements
                are surfaced, not hidden.
              </p>
              <p>
                Most postmortems are written by the people who failed — retrospective rationalization dressed
                up as insight. Autopsy is different. Six agents with six biases, forced to argue, forced to
                confront each other&apos;s blind spots. The truth lives in the disagreement.
              </p>
            </div>

            {/* Margin notes — 30% */}
            <div className="lg:w-[30%] space-y-8 font-mono text-xs text-[#4B4BA0] leading-6">
              <div>
                <span className="text-[#A1A1AA]">NOTE //</span><br />
                No single agent produces the verdict. The output is always a synthesis.
              </div>
              <div>
                <span className="text-[#A1A1AA]">NOTE //</span><br />
                Every bias is documented. Every blind spot is declared upfront.
              </div>
              <div>
                <span className="text-[#A1A1AA]">NOTE //</span><br />
                The disagreement IS the feature. Consensus without debate is just groupthink.
              </div>
            </div>
          </div>
        </motion.section>

        {/* §02 — THE 6 AGENTS */}
        <motion.section
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            &sect;02 &mdash; THE 6 AGENTS
          </span>

          <div className="mt-8 border-t border-[rgba(255,255,255,0.1)]">
            {agents.map((agent, i) => (
              <div
                key={agent.num}
                className="border-b border-[rgba(255,255,255,0.1)] py-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                  <span className="font-mono text-sm text-[#4B4BA0] tabular-nums">
                    {agent.num}
                  </span>
                  <span className="font-serif text-xl text-[white]">
                    {agent.name}
                  </span>
                </div>
                <p className="mt-2 sm:ml-12 text-base leading-7 text-[#A1A1AA]">
                  {agent.methodology}
                </p>
                <p className="mt-2 sm:ml-12 text-sm italic text-[#A1A1AA]">
                  KNOWN BIAS: {agent.bias}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* §03 — BUILT WITH */}
        <motion.section
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            &sect;03 &mdash; BUILT WITH
          </span>

          <div className="mt-8 border-t border-[rgba(255,255,255,0.1)]">
            {techStack.map((tech, i) => (
              <div
                key={tech.name}
                className="border-b border-[rgba(255,255,255,0.1)] py-4 flex items-baseline justify-between gap-4"
              >
                <span className="font-mono text-sm text-[white]">
                  {tech.name}
                </span>
                <span className="font-mono text-xs text-[#A1A1AA] text-right">
                  {tech.description}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* §04 — AMD DEVELOPER HACKATHON 2026 */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            &sect;04 &mdash; AMD DEVELOPER HACKATHON 2026
          </span>

          <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-[70%] space-y-6 font-serif text-base leading-8 text-[#A1A1AA]">
              <p>
                Autopsy was built for the AMD Developer Hackathon 2026, a global competition focused on
                leveraging AMD hardware for AI-driven applications. The project uses DeepSeek V4 Pro via
                Fireworks AI for agent reasoning and plans a migration to self-hosted inference on AMD MI300X
                GPUs for cost-efficient, high-throughput postmortem generation.
              </p>
              <p>
                The MI300X advantage is real: 192GB of HBM3 memory enables all six agents to run in parallel
                on a single GPU. On an H100 (80GB), you&apos;d need three sequential rounds. On the MI300X, the
                agents debate in real time. The hardware doesn&apos;t just make it faster — it makes the debate
                architecture possible.
              </p>
            </div>

            <div className="lg:w-[30%] font-mono text-xs text-[#4B4BA0] leading-6">
              <div>
                <span className="text-[#A1A1AA]">NOTE //</span><br />
                192GB HBM3 &mdash; 6 agents loaded simultaneously. No sequential batching. No compromise.
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.1)] px-6 py-8 sm:px-12">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-[#A1A1AA]">
            AUTOPSY / 2026 / OPEN SOURCE
          </span>
          <span className="font-mono text-xs text-[#A1A1AA]">
            Built for AMD Developer Hackathon 2026
          </span>
          <span className="font-mono text-xs text-[#A1A1AA]">
            CASE #2026-0113
          </span>
        </div>
      </footer>
    </main>
  );
}
