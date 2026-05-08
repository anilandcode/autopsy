import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#2A2A2A] bg-[#0E0E0E] px-6 py-5">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#71706B]">
            AUTOPSY / 2026 / OPEN SOURCE
          </span>

          <nav className="flex items-center font-mono text-[11px] text-[#B8B5AE]">
            <Link href="/investigate" className="transition-colors hover:text-[#F4F1EA]">
              CASE FILES
            </Link>
            <span className="mx-1.5 text-[#71706B]">/</span>
            <Link href="/architecture" className="transition-colors hover:text-[#F4F1EA]">
              ARCHITECTURE
            </Link>
            <span className="mx-1.5 text-[#71706B]">/</span>
            <Link href="/about" className="transition-colors hover:text-[#F4F1EA]">
              ABOUT
            </Link>
            <span className="mx-1.5 text-[#71706B]">/</span>
            <a
              href="https://github.com/anilandcode/autopsy"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#F4F1EA]"
            >
              GITHUB
            </a>
          </nav>

          <span className="font-mono text-[11px] text-[#71706B]">
            CASE #2026-0847
          </span>
        </div>

        <p className="mt-4 text-center font-mono text-[10px] text-[#5C5852]">
          Built for the AMD MI300X Hackathon — May 2026
        </p>
      </div>
    </footer>
  );
}
