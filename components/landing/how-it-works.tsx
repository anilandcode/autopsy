"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    step: "1",
    title: "Enter",
    description: "Type a company name, startup idea, or historical decision.",
  },
  {
    step: "2",
    title: "Research",
    description: "Six specialized agents research in parallel, each with a different lens.",
  },
  {
    step: "3",
    title: "Verdict",
    description: "A synthesized report with findings, confidence, and actionable insights.",
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
          className="text-2xl font-medium tracking-tight text-[#F4F1EA] sm:text-3xl"
        >
          How it works
        </motion.h2>

        <div className="mt-6 h-px w-full bg-[#2A2A2A]" />

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.25, delay: i * 0.05, ease: "linear" }}
              className="flex flex-col"
            >
              <span className="text-xs font-medium text-[#71706B]">
                Step {s.step}
              </span>
              <h3 className="mt-2 text-lg font-medium text-[#F4F1EA]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#B8B5AE]">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
