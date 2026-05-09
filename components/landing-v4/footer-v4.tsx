"use client";

import Link from "next/link";

export function FooterV4() {
  return (
    <footer className="border-t border-white/5 px-6 py-12 sm:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-6">
          <Link
            href="/v4"
            className="text-sm font-semibold tracking-tight text-white"
          >
            AUTOPSY
          </Link>
          <span className="text-xs text-[#737373]">Forensic Postmortem Intelligence</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-[#737373]">
          <Link href="/v4/investigate" className="transition-colors hover:text-white">
            Investigate
          </Link>
          <Link href="/architecture" className="transition-colors hover:text-white">
            Architecture
          </Link>
          <Link href="/about" className="transition-colors hover:text-white">
            About
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-[#737373]">
        Built for the AMD Pervasive AI Developer Contest. Running on MI300X.
      </p>
    </footer>
  );
}
