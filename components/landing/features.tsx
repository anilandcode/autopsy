"use client";

import { motion } from "framer-motion";
import { Target, Link2, Lightbulb, BookOpen } from "lucide-react";

const features = [
  {
    title: "Primary Cause of Death",
    description:
      "The single most important reason the startup failed — distilled from 6 independent investigative angles.",
    icon: Target,
  },
  {
    title: "Evidence Trail with Sources",
    description:
      "Every claim backed by live web search citations. No hallucinated postmortems — only sourced forensics.",
    icon: Link2,
  },
  {
    title: "What Would Have Saved It",
    description:
      "Counterfactual analysis: the single decision or pivot that could have changed the outcome.",
    icon: Lightbulb,
  },
  {
    title: "Lessons for Builders",
    description:
      "Pattern-match this failure to your own startup. Actionable takeaways distilled by the Historian agent.",
    icon: BookOpen,
  },
];

export function Features() {
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
          A complete forensic report
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex gap-5 rounded-xl border border-[#222222] bg-[#111111] p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EF4444]/10 text-[#EF4444]">
                <feat.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#FAFAFA]">
                  {feat.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#71717A]">
                  {feat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
