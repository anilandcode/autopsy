"use client";

import Link from "next/link";

export function FooterV3() {
  return (
    <footer className="border-t border-[#E2E8F0]/60 bg-white px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-lg font-semibold tracking-tight text-[#0F172A]">
            AUTOPSY
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/v3/investigate"
              className="text-sm text-[#64748B] transition-colors hover:text-[#0F172A]"
            >
              Case Files
            </Link>
            <Link
              href="/architecture"
              className="text-sm text-[#64748B] transition-colors hover:text-[#0F172A]"
            >
              Architecture
            </Link>
            <Link
              href="/about"
              className="text-sm text-[#64748B] transition-colors hover:text-[#0F172A]"
            >
              About
            </Link>
            <Link
              href="/"
              className="text-sm text-[#FD6703] transition-colors hover:text-[#E55D00]"
            >
              Classic Dark Theme
            </Link>
          </div>

          <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#94A3B8]">
            Built for the AMD MI300X Hackathon — May 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
