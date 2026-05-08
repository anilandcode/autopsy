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

export function HowItWorks() {
  return (
    <section className="border-y border-[#2A2A2A] bg-[#0E0E0E] px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.25, ease: "linear" }}
          className="font-mono text-3xl uppercase tracking-[0.1em] text-[#F4F1EA] sm:text-4xl"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          §02 — THE METHOD
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.25, delay: 0.05, ease: "linear" }}
          className="mt-3 text-xl italic text-[#B8B5AE]"
          style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
        >
          Six investigators. Six lenses. One truth.
        </motion.p>

        <div className="mt-6 h-px w-full bg-[#2A2A2A]" />

        <div className="mt-10 flex flex-col">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.num}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.25, delay: i * 0.04, ease: "linear" }}
            >
              <div className="group flex items-baseline gap-4 py-5 transition-colors duration-[250ms] sm:gap-6">
                <span
                  className="font-mono text-sm uppercase tracking-[0.1em] text-[#71706B] transition-colors duration-[250ms] group-hover:text-[#D62828]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {agent.num}
                </span>
                <span className="text-[#2A2A2A]">|</span>
                <span
                  className="text-xl text-[#F4F1EA] transition-colors duration-[250ms] group-hover:text-[#D62828] sm:text-2xl"
                  style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
                >
                  {agent.name}
                </span>
                <span className="text-[#2A2A2A]">|</span>
                <span
                  className="font-mono text-xs uppercase tracking-[0.1em] text-[#71706B] transition-colors duration-[250ms] group-hover:text-[#D62828]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {agent.methods}
                </span>
              </div>
              {i < agents.length - 1 && (
                <div className="h-px w-full bg-[#2A2A2A]" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-10 h-px w-full bg-[#2A2A2A]" />

        <div className="mt-8 flex flex-col gap-2">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.25, delay: 0.1, ease: "linear" }}
            className="font-mono text-xs uppercase tracking-[0.1em] text-[#FFD60A]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            DEBATE ROUND — Agents critique each other's findings before
            synthesis
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.25, delay: 0.15, ease: "linear" }}
            className="font-mono text-xs uppercase tracking-[0.1em] text-[#06D6A0]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            SYNTHESIZER — Weighs evidence, dissent, and agreement into one
            verdict
          </motion.p>
        </div>
      </div>
    </section>
  );
}
