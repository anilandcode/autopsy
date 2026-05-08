"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function NavV3() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E2E8F0]/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-12">
        <Link
          href="/v3"
          className="text-lg font-semibold tracking-tight text-[#0F172A]"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          AUTOPSY
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/v3/investigate"
            className="text-sm font-medium text-[#64748B] transition-colors hover:text-[#0F172A]"
          >
            Case Files
          </Link>
          <Link
            href="/architecture"
            className="text-sm font-medium text-[#64748B] transition-colors hover:text-[#0F172A]"
          >
            Architecture
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-[#64748B] transition-colors hover:text-[#0F172A]"
          >
            About
          </Link>
          <Link
            href="/v3/investigate"
            className="rounded-full bg-[#FD6703] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#E55D00] hover:shadow-lg"
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
            <X className="h-5 w-5 text-[#0F172A]" />
          ) : (
            <Menu className="h-5 w-5 text-[#0F172A]" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#E2E8F0]/60 bg-white/95 px-6 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/v3/investigate" className="text-sm font-medium text-[#64748B]" onClick={() => setMobileOpen(false)}>
              Case Files
            </Link>
            <Link href="/architecture" className="text-sm font-medium text-[#64748B]" onClick={() => setMobileOpen(false)}>
              Architecture
            </Link>
            <Link href="/about" className="text-sm font-medium text-[#64748B]" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link
              href="/v3/investigate"
              className="rounded-full bg-[#FD6703] px-5 py-2 text-center text-sm font-medium text-white"
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
