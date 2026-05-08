"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#222222] px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="font-mono text-xl font-bold tracking-wider text-[#EF4444]">
            AUTOPSY
          </span>
          <p className="text-sm text-[#71717A]">
            6 agents. 1 verdict. No survivors.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/investigate"
              className="text-[#71717A] transition-colors hover:text-[#FAFAFA]"
            >
              Launch App
            </Link>
            <Link
              href="/about"
              className="text-[#71717A] transition-colors hover:text-[#FAFAFA]"
            >
              About
            </Link>
            <a
              href="https://github.com/anilandcode/autopsy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#71717A] transition-colors hover:text-[#FAFAFA]"
            >
              <ExternalLink className="h-4 w-4" />
              GitHub
            </a>
          </div>

          <p className="mt-4 text-xs text-[#52525B]">
            Built for AMD Developer Hackathon 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
