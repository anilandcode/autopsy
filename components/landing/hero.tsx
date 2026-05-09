"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, type KeyboardEvent } from "react";

export function Hero() {
  const router = useRouter();
  const [subject, setSubject] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && subject.trim()) {
      router.push(`/investigate?subject=${encodeURIComponent(subject.trim())}`);
    }
  };

  return (
    <section className="relative min-h-screen bg-[#0E0E0E] px-0">
      {/* ── Top Nav ── */}
      <nav className="border-b border-[#2A2A2A] px-6 sm:px-12">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between py-4">
          <span
            className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#F4F1EA]"
          >
            AUTOPSY{" "}
            <span className="text-[#71706B]">/</span>{" "}
            FORENSIC INTELLIGENCE
          </span>

          <div className="flex items-center gap-6">
            <Link
              href="/investigate"
              className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#B8B5AE] transition-colors hover:text-[#F4F1EA]"
            >
              CASE FILES
            </Link>
            <Link
              href="/#whatifs"
              className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#B8B5AE] transition-colors hover:text-[#F4F1EA]"
            >
              WHAT-IFS
            </Link>
            <Link
              href="/architecture"
              className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#B8B5AE] transition-colors hover:text-[#F4F1EA]"
            >
              ARCHITECTURE
            </Link>
            <Link
              href="/about"
              className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#B8B5AE] transition-colors hover:text-[#F4F1EA]"
            >
              ABOUT
            </Link>
            <Link
              href="/investigate"
              className="inline-flex h-8 items-center justify-center rounded-none border-2 border-[#D62828] bg-transparent px-5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#D62828] transition-colors hover:bg-[#D62828] hover:text-white"
            >
              [ LAUNCH ▸ ]
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Full-bleed Hero Title ── */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "linear" }}
        className="w-full text-center font-serif leading-none tracking-[-0.04em] text-[#F4F1EA]"
        style={{
          fontSize: "clamp(120px, 22vw, 320px)",
          fontWeight: 400,
          fontFamily: '"Instrument Serif", serif',
        }}
      >
        AUTOPSY
      </motion.h1>

      {/* ── Horizontal Rule ── */}
      <div className="w-full border-t border-[#2A2A2A]" />

      {/* ── Metadata Strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.1, ease: "linear" }}
        className="mx-auto grid max-w-[1400px] grid-cols-1 sm:grid-cols-3 gap-2 px-6 py-4 sm:px-12"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#71706B]">
          ESTABLISHED 2026
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#71706B] text-center">
          CASES INVESTIGATED: ∞
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#71706B] flex items-center justify-end gap-2">
          STATUS: ACTIVE{" "}
          <span className="inline-block">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping bg-[#D62828] rounded-none" />
              <span className="relative inline-flex h-2 w-2 bg-[#D62828] rounded-none" />
            </span>
          </span>
        </span>
      </motion.div>

      {/* ── Asymmetric Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15, ease: "linear" }}
        className="mx-auto flex max-w-[1400px] flex-col px-6 pt-10 pb-20 sm:flex-row sm:px-12 sm:pt-16 sm:pb-28"
        style={{ gap: 0 }}
      >
        {/* LEFT — Tagline (60%) */}
        <div className="w-full sm:w-[60%] sm:pr-12">
          <p className="font-serif text-3xl leading-relaxed text-[#F4F1EA] sm:text-4xl">
            Forensic postmortem intelligence for failed and failing companies.
            Four modes. Six agents. One platform.
          </p>

          {/* 4-mode explainer strip */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 border-2 border-[#D62828]/40 bg-[#D62828]/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#D62828]">
              POSTMORTEM
              <span className="font-normal text-[#71706B]">Why it died</span>
            </span>
            <span className="inline-flex items-center gap-1.5 border-2 border-[#FFD60A]/40 bg-[#FFD60A]/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#FFD60A]">
              PRE-MORTEM
              <span className="font-normal text-[#71706B]">What could kill it</span>
            </span>
            <span className="inline-flex items-center gap-1.5 border-2 border-[#06D6A0]/40 bg-[#06D6A0]/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#06D6A0]">
              FOUNDER MODE
              <span className="font-normal text-[#71706B]">Will yours survive</span>
            </span>
            <span className="inline-flex items-center gap-1.5 border-2 border-[#FACC15]/40 bg-[#FACC15]/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#FACC15]">
              ⎇ COUNTERFACTUAL
              <span className="font-normal text-[#71706B]">What if they chose differently</span>
            </span>
          </div>
        </div>

        {/* RIGHT — CTA Box (40%) */}
        <div className="w-full sm:w-[40%] pt-10 sm:pt-0">
          <div className="rounded-none border-2 border-[#D62828] bg-[#161616] p-6">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#D62828]">
              ▸ ENTER SUBJECT OF INVESTIGATION
            </span>

            <div className="mt-5">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Company or product name"
                className="w-full border-b border-[#3F3F3F] bg-transparent pb-2 font-mono text-sm text-[#F4F1EA] placeholder:text-[#71706B] focus:border-[#D62828] focus:outline-none"
                style={{ borderRadius: 0 }}
              />
            </div>

            <span className="mt-3 block font-mono text-[11px] uppercase tracking-[0.1em] text-[#71706B]">
              Press Enter to begin
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
