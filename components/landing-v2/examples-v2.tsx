"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const examples = [
  {
    name: "Quibi",
    year: "2020",
    cause: "Product-market misfire",
    tag: "Postmortem",
  },
  {
    name: "Theranos",
    year: "2018",
    cause: "Fraud / culture collapse",
    tag: "Postmortem",
  },
  {
    name: "Google Glass",
    year: "2015",
    cause: "Premature market timing",
    tag: "Postmortem",
  },
  {
    name: "WeWork",
    year: "2019",
    cause: "Unit economics / governance",
    tag: "Postmortem",
  },
  {
    name: "Sidecar",
    year: "2015",
    cause: "Competitive displacement",
    tag: "Postmortem",
  },
  {
    name: "CNN+",
    year: "2022",
    cause: "Strategy / timing failure",
    tag: "Postmortem",
  },
];

export function ExamplesV2() {
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
            §01 — CASE FILES
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#3C3A39] sm:text-3xl">
            Recently investigated
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((ex, i) => (
            <motion.div
              key={ex.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                href={`/v2/investigate?subject=${encodeURIComponent(ex.name)}`}
                className="group block overflow-hidden rounded-[20px] border border-[#E5E2DD] bg-[#FEFCF5] transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Subtle green top accent */}
                <div className="h-1 w-full bg-[#81B09A]/60" />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#3C3A39]">
                        {ex.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#6B6A69]">{ex.cause}</p>
                    </div>
                    <span
                      className="rounded-full bg-[#EDE6DB] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#6B6A69]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {ex.year}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className="rounded-full bg-[#C6DACC]/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#3C3A39]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {ex.tag}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
