"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const MODES = [
  { key: "postmortem", label: "postmortem" },
  { key: "premortem", label: "pre-mortem" },
  { key: "founder", label: "founder mode" },
] as const;

type ModeKey = (typeof MODES)[number]["key"];

export function HeroV2() {
  const [query, setQuery] = useState("");
  const [activeMode, setActiveMode] = useState<ModeKey>("postmortem");
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
    <section className="relative overflow-hidden px-6 pt-16 pb-8 sm:px-12 sm:pt-24">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #D1CEC8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-[clamp(2.5rem,5.5vw,4rem)] font-medium leading-[1.1] tracking-tight text-[#3C3A39]">
            Investigate why startups fail{" "}
            <span
              className="inline-block bg-gradient-to-r from-[#81B09A] to-[#6A9580] bg-clip-text text-transparent"
            >
              with 6 AI agents
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#6B6A69]">
            Real-time parallel research, cross-agent debate, and forensic
            verdicts through a single investigation.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-8 flex items-center justify-center gap-5"
        >
          <Link
            href="/v2/investigate"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#3C3A39] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
          >
            <span>Launch Investigation</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <circle cx="12" cy="12" r="11.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M14.8518 11.4179L12.0472 8.61333L12.788 7.88574L16.9022 11.9999L12.788 16.1141L12.0472 15.3733L14.8518 12.582H7.09961V11.4179H14.8518Z"
                fill="currentColor"
              />
            </svg>
          </Link>

          <Link
            href="#method"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#6B6A69] transition-colors hover:text-[#3C3A39]"
          >
            <span>See how it works</span>
            <svg
              width="14"
              height="13"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path
                d="M11.1789 5.77581L7.36055 1.95743L8.36605 0.977383L13.9663 6.57767L8.36605 12.178L7.36055 11.1724L11.1662 7.3668L0.627478 7.3668V5.78854L11.1789 5.77581Z"
                fill="currentColor"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Search Box — frosted glass with mode tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="overflow-hidden rounded-[24px] border border-white/60 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What startup do you want to investigate?"
              className="w-full bg-transparent px-6 pt-5 pb-2 text-lg text-[#3C3A39] outline-none placeholder:text-[#A0A09E]"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            />

            <div className="flex items-center justify-between px-4 pb-3 pt-1">
              {/* Mode tabs */}
              <div className="flex items-center gap-1">
                {MODES.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setActiveMode(m.key)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium capitalize transition-all ${
                      activeMode === m.key
                        ? "bg-[#3C3A39] text-white"
                        : "text-[#A0A09E] hover:text-[#6B6A69]"
                    }`}
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Submit arrow */}
              <button
                onClick={handleSearch}
                aria-label="Submit"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm transition-transform hover:scale-105"
              >
                <svg
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.33383 3.3187L1.51783 7.1347L0.527832 6.1267L6.12583 0.528698L11.7238 6.1267L10.7158 7.1347L6.91783 3.3187V13.8667H5.33383V3.3187Z"
                    fill="#3C3A39"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient / image area */}
      <div className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-[20px]">
        <div className="relative h-64 w-full sm:h-80">
          {/* Abstract gradient background simulating Tavily's landscape */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#E8F0EA] via-[#D4E5DA] to-[#C6DACC]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(129,176,154,0.25),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(237,230,219,0.6),transparent_60%)]" />
          {/* Soft blur overlay at top to blend with cream bg */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FEFCF5] to-transparent" />
        </div>
      </div>
    </section>
  );
}
