import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#0E0E0E] px-6 text-[#F4F1EA]">
      <div className="w-full max-w-lg border-2 border-[#3F3F3F] bg-[#161616] p-8">
        {/* Classification stamp */}
        <div className="mb-6 flex justify-end">
          <span
            className="font-mono text-[10px] uppercase tracking-widest text-[#D62828]"
            style={{ transform: "rotate(4deg)", display: "inline-block" }}
          >
            CLASSIFICATION: CASE NOT FOUND
          </span>
        </div>

        <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#D62828]">
          404 — File Not Located
        </p>
        <p
          className="mt-3 text-5xl text-[#F4F1EA]"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          Case File Missing
        </p>
        <p className="mt-4 text-sm leading-6 text-[#B8B5AE]">
          The case file you requested has been redacted, relocated, or never existed
          in our records. All investigations are assigned a case number upon filing.
          If you believe this is an error, contact the records department.
        </p>

        <div className="mt-6 border-t border-[#2A2A2A] pt-6 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm text-[#71706B] transition-colors hover:text-[#F4F1EA]"
          >
            &larr; BACK TO CASE FILES
          </Link>
          <Link
            href="/investigate"
            className="inline-flex h-10 items-center gap-2 border-2 border-[#D62828] bg-[#0E0E0E] px-5 font-mono text-sm text-[#D62828] transition-colors hover:bg-[#D62828] hover:text-[#0E0E0E]"
          >
            NEW INVESTIGATION
          </Link>
        </div>
      </div>
    </main>
  );
}
