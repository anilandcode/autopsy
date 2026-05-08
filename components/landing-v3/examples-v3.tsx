"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const examples = [
  { name: "Quibi", year: "2020", cause: "Product-market misfire" },
  { name: "Theranos", year: "2018", cause: "Fraud / culture collapse" },
  { name: "Google Glass", year: "2015", cause: "Premature market timing" },
  { name: "WeWork", year: "2019", cause: "Unit economics / governance" },
  { name: "Sidecar", year: "2015", cause: "Competitive displacement" },
  { name: "CNN+", year: "2022", cause: "Strategy / timing failure" },
];

export function ExamplesV3() {
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#FD6703]">
            Case Files
          </p>
          <h2 className="mt-2 text-3xl font-medium tracking-[-0.025em] text-[#0F172A] sm:text-4xl">
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
                href={`/v3/investigate?subject=${encodeURIComponent(ex.name)}`}
                className="group block overflow-hidden rounded-2xl border border-[#E2E8F0]/60 bg-white p-6 transition-all hover:shadow-[0_8px_40px_rgba(0,0,0,0.04)] hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A]">
                      {ex.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#64748B]">{ex.cause}</p>
                  </div>
                  <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#64748B]">
                    {ex.year}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-full bg-gradient-to-r from-[#EAE2F8] to-[#F3E8FF] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[#0F172A]">
                    Postmortem
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
