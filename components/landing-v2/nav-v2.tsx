"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function NavV2() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#FEFCF5]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-12">
        <Link
          href="/v2"
          className="text-lg font-bold tracking-tight text-[#3C3A39]"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          AUTOPSY
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/v2/investigate"
            className="text-sm font-medium text-[#6B6A69] transition-colors hover:text-[#3C3A39]"
          >
            Case Files
          </Link>
          <Link
            href="/architecture"
            className="text-sm font-medium text-[#6B6A69] transition-colors hover:text-[#3C3A39]"
          >
            Architecture
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-[#6B6A69] transition-colors hover:text-[#3C3A39]"
          >
            About
          </Link>
          <Link
            href="/v2/investigate"
            className="rounded-full bg-[#3C3A39] px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
          >
            Launch
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-[#3C3A39]" />
          ) : (
            <Menu className="h-5 w-5 text-[#3C3A39]" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[#E5E2DD] bg-[#FEFCF5] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/v2/investigate"
              className="text-sm font-medium text-[#6B6A69]"
              onClick={() => setMobileOpen(false)}
            >
              Case Files
            </Link>
            <Link
              href="/architecture"
              className="text-sm font-medium text-[#6B6A69]"
              onClick={() => setMobileOpen(false)}
            >
              Architecture
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-[#6B6A69]"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/v2/investigate"
              className="rounded-full bg-[#3C3A39] px-5 py-2 text-center text-sm font-medium text-white"
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
