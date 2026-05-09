"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const cases = [
  { name: "WeWork", tag: "Premature scaling", color: "#34D399" },
  { name: "Theranos", tag: "Ethical collapse", color: "#FACC15" },
  { name: "Quibi", tag: "Market misread", color: "#34D399" },
  { name: "Sidecar", tag: "Competition loss", color: "#10B981" },
  { name: "Boo.com", tag: "Burn rate", color: "#FACC15" },
  { name: "FTX", tag: "Governance", color: "#34D399" },
];

export function ExamplesV4() {
  return (
    <section className="relative px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p
            className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#34D399]"
          >
            Open Cases
          </p>
          <h2
            className="mt-2 text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Famous postmortems
          </h2>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                href={`/v4/investigate?subject=${encodeURIComponent(c.name)}`}
                className="group block overflow-hidden rounded-lg border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{c.name}</span>
                  <span
                    className="rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                    style={{
                      background: `${c.color}15`,
                      color: c.color,
                    }}
                  >
                    {c.tag}
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
