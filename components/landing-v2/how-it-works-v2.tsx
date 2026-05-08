"use client";

import { motion } from "framer-motion";

const agents = [
  {
    num: "01",
    name: "The Market Analyst",
    methods: "TIMING / TAM / DEMAND / COMPETITION",
  },
  {
    num: "02",
    name: "The Operator",
    methods: "TEAM / EXECUTION / PIVOTS / VELOCITY",
  },
  {
    num: "03",
    name: "Money Trail",
    methods: "BURN RATE / UNIT ECONOMICS / RUNWAY / VIABILITY",
  },
  {
    num: "04",
    name: "Customer Voice",
    methods: "REVIEWS / CHURN / SENTIMENT / COMPLAINTS",
  },
  {
    num: "05",
    name: "The Engineer",
    methods: "ARCHITECTURE / TECH DEBT / SCALABILITY / TRADE-OFFS",
  },
  {
    num: "06",
    name: "The Historian",
    methods: "PATTERN MATCHING / PRECEDENT / ARCHETYPE / LONGITUDINAL",
  },
];

export function HowItWorksV2() {
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="font-mono text-xs uppercase tracking-[0.15em] text-[#81B09A]"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          §02 — THE METHOD
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-2 text-2xl font-semibold tracking-tight text-[#3C3A39] sm:text-3xl"
        >
          Six investigators. Six lenses. One truth.
        </motion.p>

        <div className="mt-6 h-px w-full bg-[#E5E2DD]" />

        <div className="mt-10 flex flex-col">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.num}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <div className="group flex items-baseline justify-between gap-4 border-b border-[#E5E2DD] py-5 transition-colors hover:bg-[#EDE6DB]/30 sm:px-4">
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-mono text-sm font-bold text-[#81B09A]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {agent.num}
                  </span>
                  <span className="text-base font-medium text-[#3C3A39]">
                    {agent.name}
                  </span>
                </div>
                <span
                  className="hidden text-right font-mono text-[10px] uppercase tracking-wider text-[#A0A09E] sm:block"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
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
          <p
            className="font-mono text-xs uppercase tracking-[0.1em] text-[#6B6A69]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            DEBATE ROUND — Agents critique each other before synthesis
          </p>
          <p
            className="font-mono text-xs uppercase tracking-[0.1em] text-[#81B09A]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            SYNTHESIZER — Weighs evidence, dissent, and agreement into one
            verdict
          </p>
        </motion.div>
      </div>
    </section>
  );
}
