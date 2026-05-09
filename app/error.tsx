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
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#1A1E1C] px-6 text-white">
      <div className="w-full max-w-lg border-2 border-white/10 bg-[#0F1110] p-8">
        {/* Classification stamp */}
        <div className="mb-6 flex justify-end">
          <span
            className="font-mono text-[10px] uppercase tracking-widest text-[#4B4BA0]"
            style={{ transform: "rotate(4deg)", display: "inline-block" }}
          >
            CLASSIFICATION: SYSTEM ERROR
          </span>
        </div>

        <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#4B4BA0]">
          Investigation Compromised
        </p>
        <p
          className="mt-3 text-3xl text-white"
          style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
        >
          An Unexpected Failure Occurred
        </p>
        <p className="mt-4 text-sm leading-6 text-[#A1A1AA]">
          The investigation pipeline encountered an unrecoverable error. This could be a
          network failure, an agent timeout, or a data integrity issue. All evidence
          gathered before the failure has been preserved.
        </p>

        {error.digest && (
          <p className="mt-4 border-t border-[rgba(255,255,255,0.1)] pt-3 font-mono text-xs text-[#A1A1AA]">
            CASE REF: {error.digest}
          </p>
        )}

        <div className="mt-6 border-t border-[rgba(255,255,255,0.1)] pt-6">
          <button
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 border-2 border-[#4B4BA0] bg-[#1A1E1C] px-5 font-mono text-sm text-[#4B4BA0] transition-colors hover:bg-[#4B4BA0] hover:text-[#0F1110]"
          >
            RESTART INVESTIGATION
          </button>
        </div>
      </div>
    </main>
  );
}
