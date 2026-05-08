"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

export function HeroV2() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/v2/investigate?subject=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:px-12 sm:pt-28 sm:pb-32">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p
            className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-[#81B09A]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            Forensic Postmortem Intelligence
          </p>
          <h1
            className="text-5xl font-bold tracking-tight text-[#3C3A39] sm:text-7xl"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            AUTOPSY
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#6B6A69]">
            6 specialized AI agents investigate why startups fail. Parallel
            research, cross-agent debate, one forensic verdict.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-lg"
        >
          <div className="flex items-center gap-2 rounded-[20px] border border-[#E5E2DD] bg-white px-4 py-3 shadow-sm transition-shadow focus-within:border-[#81B09A] focus-within:shadow-md">
            <Search className="h-4 w-4 flex-shrink-0 text-[#A0A09E]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Quibi, Theranos, your startup..."
              className="flex-1 bg-transparent text-[15px] text-[#3C3A39] outline-none placeholder:text-[#A0A09E]"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-1.5 rounded-[16px] bg-[#81B09A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6A9580]"
            >
              Investigate
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-[#A0A09E]"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          <span>6 Agents</span>
          <span>90 Seconds</span>
          <span>Parallel Research</span>
          <span>Cross-Debate</span>
          <span>Built on AMD MI300X</span>
        </motion.div>
      </div>
    </section>
  );
}
