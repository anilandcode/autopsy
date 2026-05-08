"use client";

import { motion } from "framer-motion";

export function Features() {
  return (
    <section className="border-b border-[#2A2A2A] bg-[#0E0E0E] px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.25, ease: "linear" }}
          className="font-mono text-3xl uppercase tracking-[0.1em] text-[#F4F1EA] sm:text-4xl"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          §03 — THE OUTPUT
        </motion.h2>

        <div className="mt-6 h-px w-full bg-[#2A2A2A]" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.25, ease: "linear" }}
          className="mx-auto mt-12 max-w-2xl border-2 border-[#3F3F3F] bg-[#161616] p-8 sm:p-10"
          style={{ borderRadius: 0, boxShadow: "none" }}
        >
          {/* Classification stamp */}
          <div className="mb-8 flex justify-end">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#D62828]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              CLASSIFICATION: PUBLIC RECORD
            </span>
          </div>

          {/* Primary Cause */}
          <div className="mb-6">
            <p
              className="font-mono text-xs uppercase tracking-[0.1em] text-[#D62828]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              PRIMARY CAUSE OF DEATH:
            </p>
            <p
              className="mt-2 text-xl text-[#F4F1EA]"
              style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
            >
              Premature scaling without product-market fit
            </p>
          </div>

          {/* Confidence */}
          <div className="mb-6">
            <p
              className="font-mono text-xs uppercase tracking-[0.1em] text-[#B8B5AE]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              INVESTIGATOR CONFIDENCE: 87%{" "}
              <span className="text-[#F4F1EA]">████████░░</span>
            </p>
          </div>

          {/* Redacted Evidence */}
          <div className="mb-6">
            <p
              className="font-mono text-xs uppercase tracking-[0.1em] text-[#71706B]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              EVIDENCE:
            </p>
            <p
              className="mt-1 font-mono text-sm text-[#2A2A2A]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              ██████████████████ ██████████
            </p>
          </div>

          {/* What would have saved it */}
          <div className="mb-6">
            <p
              className="font-mono text-xs uppercase tracking-[0.1em] text-[#B8B5AE]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              WHAT WOULD HAVE SAVED IT:
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              <li
                className="text-sm text-[#F4F1EA]"
                style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
              >
                <span className="text-[#06D6A0]">&#10003;</span> Pivot to
                enterprise when SMB churn exceeded 40%
              </li>
              <li
                className="text-sm text-[#F4F1EA]"
                style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
              >
                <span className="text-[#06D6A0]">&#10003;</span> Freeze hiring
                at 25 employees until net revenue retention exceeded 100%
              </li>
              <li
                className="text-sm text-[#F4F1EA]"
                style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
              >
                <span className="text-[#06D6A0]">&#10003;</span> Replace the VP
                of Sales after Q2 missed targets by 63%
              </li>
            </ul>
          </div>

          {/* Lessons for Builders */}
          <div className="mb-6">
            <p
              className="font-mono text-xs uppercase tracking-[0.1em] text-[#B8B5AE]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              LESSONS FOR BUILDERS:
            </p>
            <ol className="mt-2 flex flex-col gap-1">
              <li
                className="text-sm text-[#F4F1EA]"
                style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
              >
                <span className="font-mono text-xs text-[#71706B]">01</span>{" "}
                Premature scaling is the leading cause of startup death — verify
                before you multiply
              </li>
              <li
                className="text-sm text-[#F4F1EA]"
                style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
              >
                <span className="font-mono text-xs text-[#71706B]">02</span>{" "}
                Unit economics are non-negotiable; no amount of growth fixes a
                broken model
              </li>
              <li
                className="text-sm text-[#F4F1EA]"
                style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
              >
                <span className="font-mono text-xs text-[#71706B]">03</span>{" "}
                The team that got you here may not be the team that gets you
                there
              </li>
            </ol>
          </div>

          {/* Pivotal Disagreement */}
          <div className="mb-8">
            <p
              className="font-mono text-xs uppercase tracking-[0.1em] text-[#FFD60A]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              THE PIVOTAL DISAGREEMENT:
            </p>
            <div className="mt-2 flex flex-col gap-1 border-l-2 border-[#2A2A2A] pl-4">
              <p
                className="text-sm text-[#F4F1EA]"
                style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
              >
                <span className="font-mono text-xs text-[#D62828]">
                  MARKET ANALYST:
                </span>{" "}
                The market was ready. Demand signals were strong in Q1.
              </p>
              <p
                className="text-sm text-[#F4F1EA]"
                style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
              >
                <span className="font-mono text-xs text-[#06D6A0]">
                  THE OPERATOR:
                </span>{" "}
                Wrong. The team couldn't execute. Demand without distribution is
                a mirage.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="h-px w-full bg-[#2A2A2A]" />
          <p
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-[#71706B]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            AUTOPSY / CASE #2026-0847 / 6 AGENTS / DEEPSEEK V4 PRO
          </p>
        </motion.div>
      </div>
    </section>
  );
}
