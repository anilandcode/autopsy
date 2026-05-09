import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#1A1E1C] px-6 text-white">
      <div className="w-full max-w-lg border-2 border-white/10 bg-[#0F1110] p-8">
        {/* Classification stamp */}
        <div className="mb-6 flex justify-end">
          <span
            className="font-mono text-[10px] uppercase tracking-widest text-[#4B4BA0]"
            style={{ transform: "rotate(4deg)", display: "inline-block" }}
          >
            CLASSIFICATION: CASE NOT FOUND
          </span>
        </div>

        <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#4B4BA0]">
          404 — File Not Located
        </p>
        <p
          className="mt-3 text-5xl text-white"
          style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
        >
          Case File Missing
        </p>
        <p className="mt-4 text-sm leading-6 text-[#A1A1AA]">
          The case file you requested has been redacted, relocated, or never existed
          in our records. All investigations are assigned a case number upon filing.
          If you believe this is an error, contact the records department.
        </p>

        <div className="mt-6 border-t border-[rgba(255,255,255,0.1)] pt-6 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm text-[#A1A1AA] transition-colors hover:text-white"
          >
            &larr; BACK TO CASE FILES
          </Link>
          <Link
            href="/investigate"
            className="inline-flex h-10 items-center gap-2 border-2 border-[#4B4BA0] bg-[#1A1E1C] px-5 font-mono text-sm text-[#4B4BA0] transition-colors hover:bg-[#4B4BA0] hover:text-[#0E0E0E]"
          >
            NEW INVESTIGATION
          </Link>
        </div>
      </div>
    </main>
  );
}
