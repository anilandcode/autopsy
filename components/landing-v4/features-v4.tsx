"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function FeaturesV4() {
  return (
    <section className="relative px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#34D399]">
            Output
          </p>
          <h2
            className="mt-2 text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            What you get
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Demo card with gradient border shell */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="rounded-xl p-[1px]"
              style={{
                background:
                  "linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))",
              }}
            >
              <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
                <div className="mb-6">
                  <span className="inline-block rounded-md bg-[#34D399]/10 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#34D399]">
                    Primary Cause
                  </span>
                </div>

                <p className="text-xl font-semibold leading-snug text-white">
                  Premature scaling with unproven unit economics
                </p>

                <div className="mb-6 mt-6 border-t border-white/5 pt-6">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[#737373]">
                    What Would Have Saved It
                  </p>
                  <ul className="mt-3 flex flex-col gap-2">
                    <li className="flex items-start gap-2 text-sm text-[#D4D4D4]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#34D399]" />
                      Pivot to enterprise when SMB churn exceeded 40%
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#D4D4D4]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#34D399]" />
                      Freeze hiring at 25 employees until NRR exceeded 100%
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#D4D4D4]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#34D399]" />
                      Replace the VP of Sales after Q2 missed targets by 63%
                    </li>
                  </ul>
                </div>

                <div className="mb-6 border-t border-white/5 pt-6">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[#737373]">
                    Lessons for Builders
                  </p>
                  <ol className="mt-3 flex flex-col gap-2">
                    <li className="flex items-start gap-2 text-sm text-[#D4D4D4]">
                      <span className="font-mono text-xs text-[#737373]">01</span>
                      Premature scaling is the leading cause of startup death
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#D4D4D4]">
                      <span className="font-mono text-xs text-[#737373]">02</span>
                      Unit economics are non-negotiable
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#D4D4D4]">
                      <span className="font-mono text-xs text-[#737373]">03</span>
                      The team that got you here may not get you there
                    </li>
                  </ol>
                </div>

                <div className="h-px w-full bg-white/5" />
                <p className="mt-4 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#737373]">
                  AUTOPSY / CASE #2026-0847 / 6 AGENTS / DEEPSEEK V4 PRO
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature list */}
          <div className="flex flex-col gap-6">
            {[
              {
                title: "Parallel Research",
                desc: "6 agents scrape, search, and analyze simultaneously across 10+ sources.",
              },
              {
                title: "Cross-Agent Debate",
                desc: "Agents critique each other's findings before synthesis. Disagreement is surfaced, not hidden.",
              },
              {
                title: "Forensic Verdict",
                desc: "One primary cause, confidence score, what would have saved it, and lessons for builders.",
              },
              {
                title: "Exportable Reports",
                desc: "Download a clean PDF of every investigation. Share with your team or investors.",
              },
              {
                title: "Three Modes",
                desc: "Postmortem, Pre-Mortem, and Founder Mode — each tuned for a different stage of insight.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex gap-4"
              >
                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#34D399]/10">
                  <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#D4D4D4]">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
