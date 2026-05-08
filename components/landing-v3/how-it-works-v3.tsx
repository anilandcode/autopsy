"use client";

import { motion } from "framer-motion";

const agents = [
  { num: "01", name: "The Market Analyst", methods: "TIMING / TAM / DEMAND / COMPETITION" },
  { num: "02", name: "The Operator", methods: "TEAM / EXECUTION / PIVOTS / VELOCITY" },
  { num: "03", name: "Money Trail", methods: "BURN RATE / UNIT ECONOMICS / RUNWAY / VIABILITY" },
  { num: "04", name: "Customer Voice", methods: "REVIEWS / CHURN / SENTIMENT / COMPLAINTS" },
  { num: "05", name: "The Engineer", methods: "ARCHITECTURE / TECH DEBT / SCALABILITY / TRADE-OFFS" },
  { num: "06", name: "The Historian", methods: "PATTERN MATCHING / PRECEDENT / ARCHETYPE / LONGITUDINAL" },
];

export function HowItWorksV3() {
  return (
    <section id="method" className="border-y border-[#E2E8F0]/60 bg-[#F8FAFC] px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#FD6703]">
            The Method
          </p>
          <h2 className="mt-2 text-3xl font-medium tracking-[-0.025em] text-[#0F172A] sm:text-4xl">
            Six investigators. Six lenses. One truth.
          </h2>
        </motion.div>

        <div className="mt-6 h-px w-full bg-[#E2E8F0]" />

        <div className="mt-10 flex flex-col">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.num}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <div className="group flex items-baseline justify-between gap-4 border-b border-[#E2E8F0]/60 py-5 transition-colors hover:bg-white/50 sm:px-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm font-semibold text-[#FD6703]">
                    {agent.num}
                  </span>
                  <span className="text-base font-medium text-[#0F172A]">
                    {agent.name}
                  </span>
                </div>
                <span className="hidden text-right font-mono text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] sm:block">
                  {agent.methods}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex flex-col gap-2"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-[#64748B]">
            Debate Round — Agents critique each other before synthesis
          </p>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-[#FD6703]">
            Synthesizer — Weighs evidence, dissent, and agreement into one verdict
          </p>
        </motion.div>
      </div>
    </section>
  );
}
