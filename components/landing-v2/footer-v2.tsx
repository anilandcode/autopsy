"use client";

import Link from "next/link";

export function FooterV2() {
  return (
    <footer className="border-t border-[#E5E2DD] bg-[#FEFCF5] px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <p
            className="text-lg font-bold tracking-tight text-[#3C3A39]"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            AUTOPSY
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/v2/investigate"
              className="text-sm text-[#6B6A69] transition-colors hover:text-[#3C3A39]"
            >
              Case Files
            </Link>
            <Link
              href="/architecture"
              className="text-sm text-[#6B6A69] transition-colors hover:text-[#3C3A39]"
            >
              Architecture
            </Link>
            <Link
              href="/about"
              className="text-sm text-[#6B6A69] transition-colors hover:text-[#3C3A39]"
            >
              About
            </Link>
            <Link
              href="/"
              className="text-sm text-[#81B09A] transition-colors hover:text-[#6A9580]"
            >
              Classic Dark Theme
            </Link>
          </div>

          <p
            className="font-mono text-[11px] uppercase tracking-wider text-[#A0A09E]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            Built for the AMD MI300X Hackathon — May 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
