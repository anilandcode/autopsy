"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getDemoCases } from "@/lib/failure-database";

const demoCases = getDemoCases();

const cfScenarios = [
  {
    id: "blockbuster-netflix",
    title: "BLOCKBUSTER × NETFLIX",
    question: "What if Blockbuster had acquired Netflix for $50M in 2000?",
    year: 2000,
    subject: "Blockbuster",
    originalDecision: "Declined to acquire Netflix for $50M in 2000",
    alternateDecision: "Acquired Netflix in 2000 and pivoted to streaming",
  },
  {
    id: "kodak-digital",
    title: "KODAK × DIGITAL",
    question: "What if Kodak had commercialized their own digital camera invention?",
    year: 1975,
    subject: "Kodak",
    originalDecision: "Suppressed digital photography to protect film business",
    alternateDecision: "Commercialized their digital camera invention and led the market transition",
  },
  {
    id: "yahoo-google",
    title: "YAHOO × GOOGLE",
    question: "What if Yahoo had acquired Google for $1M in 1998?",
    year: 1998,
    subject: "Yahoo",
    originalDecision: "Passed on acquiring Google for $1M in 1998",
    alternateDecision: "Acquired Google in 1998 and built a search powerhouse",
  },
  {
    id: "quibi-tv",
    title: "QUIBI × TV LAUNCH",
    question: "What if Quibi had launched on television simultaneously?",
    year: 2020,
    subject: "Quibi",
    originalDecision: "Launched as mobile-only streaming platform",
    alternateDecision: "Launched on TV and mobile simultaneously",
  },
  {
    id: "theranos-science",
    title: "THERANOS × REAL SCIENCE",
    question: "What if Theranos had hired real scientists and been transparent?",
    year: 2010,
    subject: "Theranos",
    originalDecision: "Falsified test results instead of building real technology",
    alternateDecision: "Hired a real scientific advisory board and built legitimate diagnostics",
  },
  {
    id: "myspace-tech",
    title: "MYSPACE × BETTER TECH",
    question: "What if MySpace had rebuilt their codebase before Facebook scaled?",
    year: 2006,
    subject: "MySpace",
    originalDecision: "Neglected platform technology and user experience",
    alternateDecision: "Invested heavily in technology rebuild and clean user experience",
  },
];

export function Examples() {
  return (
    <>
      <section className="px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <h2 className="text-left font-mono text-3xl tracking-tight text-[#F4F1EA] sm:text-4xl">
            §01 — RECENT CASE FILES
          </h2>

          {/* Horizontal rule */}
          <div className="mt-4 h-px w-full bg-[#2A2A2A]" />

          {/* Case file grid */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demoCases.map((c, i) => {
              const fileNumber = String(i + 1).padStart(3, "0");

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.25, delay: i * 0.04, ease: "linear" }}
                >
                  <Link
                    href={`/investigate?subject=${encodeURIComponent(c.name)}`}
                    className="group flex h-full flex-col rounded-none border-2 border-[#3F3F3F] bg-[#161616] transition-colors hover:border-[#D62828]/50"
                  >
                    {/* Yellow top stripe */}
                    <div className="flex h-2 items-center overflow-hidden bg-[#FFD60A] transition-all duration-[250ms] ease-linear group-hover:h-4">
                      <span className="pl-3 font-mono text-[9px] font-medium uppercase tracking-[0.1em] text-black">
                        FILE #{fileNumber}
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-serif text-2xl leading-tight text-[#F4F1EA] sm:text-3xl">
                        {c.name}
                      </h3>
                      <span className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#71706B]">
                        {c.yearFounded} — {c.yearDied}
                      </span>
                      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#5C5852]">
                        {c.industry}
                      </span>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#B8B5AE]">
                        {c.oneLiner}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-[#2A2A2A] pt-3">
                        <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#D62828]">
                          CAPITAL BURNED: {c.capitalRaised}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#D62828] opacity-0 transition-opacity duration-[250ms] ease-linear group-hover:opacity-100">
                          INVESTIGATE ▸
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* §02 — FAMOUS WHAT-IFS */}
      <section id="whatifs" className="px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-left font-mono text-3xl tracking-tight text-[#F4F1EA] sm:text-4xl">
            §02 — FAMOUS WHAT-IFS
          </h2>
          <p className="mt-2 font-mono text-sm uppercase tracking-[0.1em] text-[#71706B]">
            History&apos;s most consequential decisions — reimagined
          </p>
          <div className="mt-4 h-px w-full bg-[#2A2A2A]" />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cfScenarios.map((cf, i) => {
              const fileNumber = String(i + 1).padStart(3, "0");
              const cfUrl = `/investigate?mode=counterfactual&subject=${encodeURIComponent(cf.subject)}&originalDecision=${encodeURIComponent(cf.originalDecision)}&alternateDecision=${encodeURIComponent(cf.alternateDecision)}`;

              return (
                <motion.div
                  key={cf.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.25, delay: i * 0.04, ease: "linear" }}
                >
                  <Link
                    href={cfUrl}
                    className="group flex h-full flex-col rounded-none border-2 border-[#3F3F3F] bg-[#161616] transition-colors hover:border-[#FACC15]/50"
                  >
                    {/* Yellow top stripe with timeline icon */}
                    <div className="flex h-2 items-center overflow-hidden bg-[#FACC15] transition-all duration-[250ms] ease-linear group-hover:h-4">
                      <span className="pl-3 font-mono text-[9px] font-medium uppercase tracking-[0.1em] text-black">
                        ⎇ WHAT-IF #{fileNumber}
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-mono text-lg font-bold uppercase tracking-[0.05em] text-[#FACC15]">
                        {cf.title}
                      </h3>
                      <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[#71706B]">
                        YEAR: {cf.year}
                      </span>

                      {/* Diverging timeline visual */}
                      <div className="mt-4 flex flex-col gap-0.5">
                        <div className="h-px w-1/2 bg-[#5C5852]" />
                        <div className="flex">
                          <div className="h-px w-1/2 bg-[#5C5852]" />
                          <div className="h-px flex-1 bg-[#D62828]" />
                        </div>
                        <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider">
                          <span className="text-[#5C5852]">ACTUAL</span>
                          <span className="text-[#D62828]">ALTERNATE</span>
                        </div>
                      </div>

                      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#B8B5AE]">
                        {cf.question}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-[#2A2A2A] pt-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5C5852]">
                          PROBABILITY SHIFT: [?]% → [?]%
                        </span>
                        <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#FACC15] opacity-0 transition-opacity duration-[250ms] ease-linear group-hover:opacity-100">
                          EXPLORE ▸
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
