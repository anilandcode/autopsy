"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, type KeyboardEvent } from "react";

type Mode = "postmortem" | "premortem" | "founder" | "counterfactual";

const MODES: { id: Mode; label: string; description: string }[] = [
  { id: "postmortem", label: "Postmortem", description: "Why it died" },
  { id: "premortem", label: "Pre-Mortem", description: "What could kill it" },
  { id: "founder", label: "Founder Mode", description: "Will yours survive" },
  { id: "counterfactual", label: "Counterfactual", description: "What if they chose differently" },
];

export function Hero() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [mode, setMode] = useState<Mode>("postmortem");
  const [deep, setDeep] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && subject.trim()) {
      const params = new URLSearchParams();
      params.set("subject", subject.trim());
      params.set("mode", mode);
      if (deep) params.set("deep", "true");
      router.push(`/investigate?${params.toString()}`);
    }
  };

  const handleSubmit = () => {
    if (!subject.trim()) return;
    const params = new URLSearchParams();
    params.set("subject", subject.trim());
    params.set("mode", mode);
    if (deep) params.set("deep", "true");
    router.push(`/investigate?${params.toString()}`);
  };

  return (
    <section className="relative flex min-h-[85vh] flex-col bg-[#0E0E0E] px-6">
      {/* Nav */}
      <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between py-5">
        <span className="text-sm font-medium tracking-tight text-[#F4F1EA]">
          Autopsy
        </span>
        <div className="flex items-center gap-6">
          <Link
            href="/investigate"
            className="text-xs text-[#B8B5AE] transition-colors hover:text-[#F4F1EA]"
          >
            Investigate
          </Link>
          <Link
            href="/architecture"
            className="text-xs text-[#B8B5AE] transition-colors hover:text-[#F4F1EA]"
          >
            Architecture
          </Link>
          <Link
            href="/about"
            className="text-xs text-[#B8B5AE] transition-colors hover:text-[#F4F1EA]"
          >
            About
          </Link>
          <Link
            href="/investigate"
            className="inline-flex h-8 items-center justify-center rounded-md border border-[#D62828] px-4 text-xs font-medium text-[#D62828] transition-colors hover:bg-[#D62828] hover:text-white"
          >
            Launch
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <div className="flex flex-1 flex-col items-center justify-center pb-16 pt-8">
        {/* Small wordmark */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm tracking-wide text-[#71706B]"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          Autopsy
        </motion.p>

        {/* Main search input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mt-8 w-full max-w-2xl"
        >
          <div className="flex items-center rounded-xl border border-[#3F3F3F] bg-[#161616] px-5 py-4 transition-colors focus-within:border-[#D62828]">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Investigate a company — Quibi, Theranos, Figma..."
              className="flex-1 bg-transparent text-lg text-[#F4F1EA] placeholder:text-[#71706B] focus:outline-none"
              autoFocus
            />
            {subject.trim() && (
              <button
                onClick={handleSubmit}
                className="ml-3 inline-flex h-9 items-center justify-center rounded-md bg-[#D62828] px-4 text-sm font-medium text-white transition-colors hover:bg-[#B91C1C]"
              >
                Enter
              </button>
            )}
          </div>
        </motion.div>

        {/* Mode pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                mode === m.id
                  ? "border-[#D62828] bg-[#D62828]/10 text-[#F4F1EA]"
                  : "border-[#2A2A2A] bg-[#161616] text-[#B8B5AE] hover:border-[#3F3F3F] hover:text-[#F4F1EA]"
              }`}
            >
              <span className="font-medium">{m.label}</span>
              <span className="text-xs text-[#71706B]">{m.description}</span>
            </button>
          ))}
        </motion.div>

        {/* Deep research toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mt-4 flex items-center gap-2"
        >
          <button
            onClick={() => setDeep(!deep)}
            className={`flex h-5 w-9 items-center rounded-full transition-colors ${
              deep ? "bg-[#D62828]" : "bg-[#2A2A2A]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                deep ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="text-xs text-[#71706B]">
            Deep research — slower, more thorough
          </span>
        </motion.div>

        {/* Value prop */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8 text-center text-sm text-[#71706B]"
        >
          Research why companies fail with six specialized analysts.
        </motion.p>
      </div>
    </section>
  );
}
