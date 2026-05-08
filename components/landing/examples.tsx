"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getDemoCases } from "@/lib/failure-database";

const demoCases = getDemoCases();

export function Examples() {
  return (
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
                    {/* Company name */}
                    <h3 className="font-serif text-2xl leading-tight text-[#F4F1EA] sm:text-3xl">
                      {c.name}
                    </h3>

                    {/* Years lived */}
                    <span className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#71706B]">
                      {c.yearFounded} — {c.yearDied}
                    </span>

                    {/* Industry */}
                    <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#5C5852]">
                      {c.industry}
                    </span>

                    {/* One-line cause */}
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#B8B5AE]">
                      {c.oneLiner}
                    </p>

                    {/* Bottom section */}
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
  );
}
