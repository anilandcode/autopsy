import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#2A2A2A] bg-[#0E0E0E] px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <span className="text-xs text-[#71706B]">
            Autopsy / 2026 / Open source
          </span>

          <nav className="flex items-center gap-4 text-xs text-[#B8B5AE]">
            <Link href="/investigate" className="transition-colors hover:text-[#F4F1EA]">
              Investigate
            </Link>
            <Link href="/architecture" className="transition-colors hover:text-[#F4F1EA]">
              Architecture
            </Link>
            <Link href="/about" className="transition-colors hover:text-[#F4F1EA]">
              About
            </Link>
            <a
              href="https://github.com/anilandcode/autopsy"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#F4F1EA]"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
