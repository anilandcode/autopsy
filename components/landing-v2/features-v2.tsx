"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function FeaturesV2() {
  return (
    <section className="border-y border-[#E5E2DD] bg-white px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <p
            className="font-mono text-xs uppercase tracking-[0.15em] text-[#81B09A]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            §03 — OUTPUT
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#3C3A39] sm:text-3xl">
            What you get
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Demo card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-[20px] border border-[#E5E2DD] bg-[#FEFCF5]"
          >
            <div className="border-b border-[#E5E2DD] bg-[#EDE6DB]/50 px-6 py-4">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6B6A69]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                FORENSIC REPORT / CASE #2026-0847
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <span
                  className="inline-block rounded-full bg-[#C6DACC] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#3C3A39]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  PRIMARY CAUSE
                </span>
                <p className="mt-2 text-xl font-semibold leading-7 text-[#3C3A39]">
                  Premature scaling with unproven unit economics
                </p>
              </div>

              <div className="mb-6">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6A69]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  WHAT WOULD HAVE SAVED IT:
                </p>
                <ul className="mt-2 flex flex-col gap-2">
                  <li className="flex items-start gap-2 text-sm text-[#3C3A39]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#81B09A]" />
                    Pivot to enterprise when SMB churn exceeded 40%
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#3C3A39]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#81B09A]" />
                    Freeze hiring at 25 employees until NRR exceeded 100%
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#3C3A39]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#81B09A]" />
                    Replace the VP of Sales after Q2 missed targets by 63%
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6A69]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  LESSONS FOR BUILDERS:
                </p>
                <ol className="mt-2 flex flex-col gap-2">
                  <li className="flex items-start gap-2 text-sm text-[#3C3A39]">
                    <span
                      className="font-mono text-xs text-[#A0A09E]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      01
                    </span>
                    Premature scaling is the leading cause of startup death
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#3C3A39]">
                    <span
                      className="font-mono text-xs text-[#A0A09E]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      02
                    </span>
                    Unit economics are non-negotiable
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#3C3A39]">
                    <span
                      className="font-mono text-xs text-[#A0A09E]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      03
                    </span>
                    The team that got you here may not get you there
                  </li>
                </ol>
              </div>

              <div className="mb-6">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6A69]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  PIVOTAL DISAGREEMENT:
                </p>
                <div className="mt-2 space-y-2 border-l-2 border-[#E5E2DD] pl-4">
                  <p className="text-sm text-[#3C3A39]">
                    <span
                      className="font-mono text-xs text-[#81B09A]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      MARKET ANALYST:
                    </span>{" "}
                    The market was ready. Demand signals were strong in Q1.
                  </p>
                  <p className="text-sm text-[#3C3A39]">
                    <span
                      className="font-mono text-xs text-[#6B6A69]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      THE OPERATOR:
                    </span>{" "}
                    Wrong. The team couldn't execute. Demand without distribution
                    is a mirage.
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-[#E5E2DD]" />
              <p
                className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-[#A0A09E]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                AUTOPSY / CASE #2026-0847 / 6 AGENTS / DEEPSEEK V4 PRO
              </p>
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
                desc: "Postmortem (what failed), Pre-Mortem (what could go wrong), Founder Mode (will your idea survive).",
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
                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#C6DACC]">
                  <CheckCircle2 className="h-4 w-4 text-[#4A9B7F]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#3C3A39]">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#6B6A69]">
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
