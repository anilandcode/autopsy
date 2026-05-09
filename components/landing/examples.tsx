"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getDemoCases } from "@/lib/failure-database";

const demoCases = getDemoCases();

const cfScenarios = [
  {
    id: "blockbuster-netflix",
    title: "Blockbuster × Netflix",
    question: "What if Blockbuster had acquired Netflix for $50M in 2000?",
    year: 2000,
    subject: "Blockbuster",
    originalDecision: "Declined to acquire Netflix for $50M in 2000",
    alternateDecision: "Acquired Netflix in 2000 and pivoted to streaming",
  },
  {
    id: "kodak-digital",
    title: "Kodak × Digital",
    question: "What if Kodak had commercialized their own digital camera invention?",
    year: 1975,
    subject: "Kodak",
    originalDecision: "Suppressed digital photography to protect film business",
    alternateDecision: "Commercialized their digital camera invention and led the market transition",
  },
  {
    id: "yahoo-google",
    title: "Yahoo × Google",
    question: "What if Yahoo had acquired Google for $1M in 1998?",
    year: 1998,
    subject: "Yahoo",
    originalDecision: "Passed on acquiring Google for $1M in 1998",
    alternateDecision: "Acquired Google in 1998 and built a search powerhouse",
  },
  {
    id: "quibi-tv",
    title: "Quibi × TV Launch",
    question: "What if Quibi had launched on television simultaneously?",
    year: 2020,
    subject: "Quibi",
    originalDecision: "Launched as mobile-only streaming platform",
    alternateDecision: "Launched on TV and mobile simultaneously",
  },
  {
    id: "theranos-science",
    title: "Theranos × Real Science",
    question: "What if Theranos had hired real scientists and been transparent?",
    year: 2010,
    subject: "Theranos",
    originalDecision: "Falsified test results instead of building real technology",
    alternateDecision: "Hired a real scientific advisory board and built legitimate diagnostics",
  },
  {
    id: "myspace-tech",
    title: "MySpace × Better Tech",
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
          <h2 className="text-left text-2xl font-medium tracking-tight text-[#F4F1EA] sm:text-3xl">
            Recent cases
          </h2>
          <p className="mt-2 text-sm text-[#71706B]">
            Investigate why companies failed
          </p>
          <div className="mt-4 h-px w-full bg-[#2A2A2A]" />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demoCases.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.25, delay: i * 0.04, ease: "linear" }}
              >
                <Link
                  href={`/investigate?subject=${encodeURIComponent(c.name)}`}
                  className="group flex h-full flex-col rounded-lg border border-[#3F3F3F] bg-[#161616] transition-colors hover:border-[#D62828]/50"
                >
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-xl font-medium leading-tight text-[#F4F1EA]">
                      {c.name}
                    </h3>
                    <span className="mt-1.5 text-xs text-[#71706B]">
                      {c.yearFounded} — {c.yearDied}
                    </span>
                    <span className="mt-1 text-xs text-[#5C5852]">
                      {c.industry}
                    </span>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#B8B5AE]">
                      {c.oneLiner}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-[#2A2A2A] pt-3">
                      <span className="text-xs text-[#D62828]">
                        Capital burned: {c.capitalRaised}
                      </span>
                      <span className="text-xs text-[#D62828] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        Investigate
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="whatifs" className="px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-left text-2xl font-medium tracking-tight text-[#F4F1EA] sm:text-3xl">
            Famous what-ifs
          </h2>
          <p className="mt-2 text-sm text-[#71706B]">
            History&apos;s most consequential decisions — reimagined
          </p>
          <div className="mt-4 h-px w-full bg-[#2A2A2A]" />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cfScenarios.map((cf, i) => {
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
                    className="group flex h-full flex-col rounded-lg border border-[#3F3F3F] bg-[#161616] transition-colors hover:border-[#FACC15]/50"
                  >
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-medium text-[#FACC15]">
                        {cf.title}
                      </h3>
                      <span className="mt-1 text-xs text-[#71706B]">
                        Year: {cf.year}
                      </span>

                      <div className="mt-4 flex flex-col gap-0.5">
                        <div className="h-px w-1/2 bg-[#5C5852]" />
                        <div className="flex">
                          <div className="h-px w-1/2 bg-[#5C5852]" />
                          <div className="h-px flex-1 bg-[#D62828]" />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[#5C5852]">Actual</span>
                          <span className="text-[#D62828]">Alternate</span>
                        </div>
                      </div>

                      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#B8B5AE]">
                        {cf.question}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-[#2A2A2A] pt-3">
                        <span className="text-xs text-[#5C5852]">
                          Probability shift
                        </span>
                        <span className="text-xs text-[#FACC15] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          Explore
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
