"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#0E0E0E] px-6 text-[#F4F1EA]">
      <div className="w-full max-w-lg border-2 border-[#3F3F3F] bg-[#161616] p-8">
        {/* Classification stamp */}
        <div className="mb-6 flex justify-end">
          <span
            className="font-mono text-[10px] uppercase tracking-widest text-[#D62828]"
            style={{ transform: "rotate(4deg)", display: "inline-block" }}
          >
            CLASSIFICATION: SYSTEM ERROR
          </span>
        </div>

        <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#D62828]">
          Investigation Compromised
        </p>
        <p
          className="mt-3 text-3xl text-[#F4F1EA]"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          An Unexpected Failure Occurred
        </p>
        <p className="mt-4 text-sm leading-6 text-[#B8B5AE]">
          The investigation pipeline encountered an unrecoverable error. This could be a
          network failure, an agent timeout, or a data integrity issue. All evidence
          gathered before the failure has been preserved.
        </p>

        {error.digest && (
          <p className="mt-4 border-t border-[#2A2A2A] pt-3 font-mono text-xs text-[#5C5852]">
            CASE REF: {error.digest}
          </p>
        )}

        <div className="mt-6 border-t border-[#2A2A2A] pt-6">
          <button
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 border-2 border-[#D62828] bg-[#0E0E0E] px-5 font-mono text-sm text-[#D62828] transition-colors hover:bg-[#D62828] hover:text-[#0E0E0E]"
          >
            RESTART INVESTIGATION
          </button>
        </div>
      </div>
    </main>
  );
}
