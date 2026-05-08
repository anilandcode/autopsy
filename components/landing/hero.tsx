"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-8 pb-20 sm:px-12 sm:pt-12 sm:pb-28">
      {/* Subtle red radial glow behind headline */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse at center, #EF4444 0%, transparent 70%)",
        }}
      />

      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between pb-16 sm:pb-24">
        <span className="font-mono text-lg font-bold tracking-wider text-[#EF4444]">
          AUTOPSY
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm text-[#71717A] transition-colors hover:text-[#FAFAFA]"
          >
            About
          </Link>
          <Link
            href="/investigate"
            className="inline-flex h-9 items-center justify-center rounded-full bg-[#EF4444] px-5 text-sm font-medium text-white hover:bg-[#DC2626]"
          >
            Launch App
          </Link>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-balance text-5xl font-bold tracking-tight text-[#FAFAFA] sm:text-7xl"
        >
          Find Out Why It Died.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-[#71717A] sm:text-xl"
        >
          6 AI agents investigate any failed startup, product, or company.
          Get a forensic postmortem in 90 seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <Link
            href="/investigate"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#EF4444] px-8 text-base font-semibold text-white shadow-lg shadow-[#EF4444]/20 transition-all hover:bg-[#DC2626] hover:shadow-[#EF4444]/30"
          >
            Start Investigation
            <ArrowRight className="h-5 w-5" />
          </Link>
          <span className="text-xs text-[#71717A]">
            Powered by DeepSeek V4 Pro on AMD MI300X
          </span>
        </motion.div>
      </div>
    </section>
  );
}
