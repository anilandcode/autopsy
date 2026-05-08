"use client";

import type { InvestigationMode } from "@/types/investigation";

interface ModeSwitcherV2Props {
  mode: InvestigationMode;
  onChange: (mode: InvestigationMode) => void;
}

export function ModeSwitcherV2({ mode, onChange }: ModeSwitcherV2Props) {
  const modes: { value: InvestigationMode; label: string; activeColor: string }[] = [
    { value: "postmortem", label: "Postmortem", activeColor: "bg-[#81B09A] text-white border-[#81B09A]" },
    { value: "premortem", label: "Pre-Mortem", activeColor: "bg-[#EDE6DB] text-[#3C3A39] border-[#D1CEC8]" },
    { value: "founder", label: "Founder Mode", activeColor: "bg-[#C6DACC] text-[#3C3A39] border-[#81B09A]" },
  ];

  return (
    <div className="mb-10 flex w-full max-w-lg overflow-hidden rounded-[20px] border border-[#E5E2DD] bg-white p-1">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`flex-1 rounded-[16px] py-2.5 text-center font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${
            mode === m.value
              ? m.activeColor
              : "text-[#A0A09E] hover:text-[#6B6A69]"
          }`}
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
