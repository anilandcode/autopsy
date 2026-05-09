"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Submit",
    desc: "Enter a startup name, URL, or describe a company. Pick a mode: postmortem, premortem, or founder mode.",
  },
  {
    num: "02",
    title: "Parallel Research",
    desc: "6 specialized agents scrape, search, and analyze across 10+ sources simultaneously.",
  },
  {
    num: "03",
    title: "Cross-Agent Debate",
    desc: "Agents critique each other's findings before synthesis. Disagreement is surfaced, not hidden.",
  },
  {
    num: "04",
    title: "Forensic Verdict",
    desc: "One primary cause, confidence score, what would have saved it, and lessons for builders.",
  },
];

export function HowItWorksV4() {
  return (
    <section id="method" className="relative px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#34D399]">
            Method
          </p>
          <h2
            className="mt-2 text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            How it works
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="rounded-lg border border-white/5 bg-white/[0.03] p-5 backdrop-blur-sm"
            >
              <span className="font-mono text-xs text-[#737373]">{step.num}</span>
              <h3 className="mt-2 text-sm font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#D4D4D4]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
