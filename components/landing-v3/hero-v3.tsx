"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroV3() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/v3/investigate?subject=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-8 sm:px-12 sm:pt-28">
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-[clamp(2.5rem,5.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.025em] text-[#0F172A]">
            Investigate why startups{" "}
            <span className="inline-block bg-gradient-to-r from-[#FD6703] to-[#F5A345] bg-clip-text text-transparent">
              fail
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#64748B]">
            Real-time parallel research, cross-agent debate, and forensic
            verdicts through a single investigation.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Link
            href="/v3/investigate"
            className="group inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#1E293B] hover:shadow-lg"
          >
            <span>Launch Investigation</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <circle cx="12" cy="12" r="11.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M14.85 11.42L12.05 8.62L12.79 7.89L16.9 12L12.79 16.11L12.05 15.37L14.85 12.58H7.1V11.42H14.85Z"
                fill="currentColor"
              />
            </svg>
          </Link>

          <Link
            href="#method"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#0F172A]"
          >
            <span>See how it works</span>
            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" className="transition-transform group-hover:translate-x-0.5">
              <path d="M11.18 5.78L7.36 1.96L8.37.98L13.97 6.58L8.37 12.18L7.36 11.17L11.17 7.37H.63V5.79H11.18Z" fill="currentColor" />
            </svg>
          </Link>
        </motion.div>

        {/* Glass Search Box with gradient border shell */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-12 max-w-2xl"
        >
          {/* Gradient border shell */}
          <div
            className="rounded-2xl p-[1px]"
            style={{
              background: "linear-gradient(to right top, rgb(226, 216, 240), rgb(250, 221, 240))",
            }}
          >
            <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What startup do you want to investigate?"
                className="w-full bg-transparent px-6 pt-5 pb-2 text-lg text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              />

              <div className="flex items-center justify-between px-4 pb-3 pt-1">
                <div className="flex items-center gap-1">
                  {["postmortem", "premortem", "founder mode"].map((m) => (
                    <span
                      key={m}
                      className="rounded-full px-3 py-1 text-[11px] font-medium capitalize text-[#94A3B8]"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleSearch}
                  aria-label="Submit"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F172A] text-white shadow-sm transition-transform hover:scale-105"
                >
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                    <path d="M5.33 3.32L1.52 7.13L.53 6.13L6.13.53l5.6 5.6-1.01 1.01L6.92 3.32v10.55H5.33V3.32Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient card area */}
      <div className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl">
        <div className="relative h-56 w-full sm:h-72">
          <div className="absolute inset-0 bg-gradient-to-br from-[#EAE2F8] via-[#F3E8FF] to-[#FCE7F3]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#E0F2FE] to-[#FCE7F3] opacity-60" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}
