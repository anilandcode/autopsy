"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function NavV4() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-12">
        <Link
          href="/v4"
          className="text-lg font-semibold tracking-tight text-white"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          AUTOPSY
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/v4/investigate"
            className="text-sm font-medium text-[#D4D4D4] transition-colors hover:text-white"
          >
            Case Files
          </Link>
          <Link
            href="/architecture"
            className="text-sm font-medium text-[#D4D4D4] transition-colors hover:text-white"
          >
            Architecture
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-[#D4D4D4] transition-colors hover:text-white"
          >
            About
          </Link>
          <Link
            href="/v4/investigate"
            className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-[#050505] transition-all hover:bg-[#34D399] hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]"
          >
            Launch
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <Menu className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-[#050505]/95 px-6 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/v4/investigate" className="text-sm font-medium text-[#D4D4D4]" onClick={() => setMobileOpen(false)}>
              Case Files
            </Link>
            <Link href="/architecture" className="text-sm font-medium text-[#D4D4D4]" onClick={() => setMobileOpen(false)}>
              Architecture
            </Link>
            <Link href="/about" className="text-sm font-medium text-[#D4D4D4]" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link
              href="/v4/investigate"
              className="rounded-lg bg-white px-5 py-2 text-center text-sm font-medium text-[#050505]"
              onClick={() => setMobileOpen(false)}
            >
              Launch
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
