export default function Loading() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#1A1E1C] px-6 text-white">
      <div className="w-full max-w-lg border-2 border-white/10 bg-[#0F1110] p-8">
        <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#A1A1AA]">
          Loading Case File&hellip;
        </p>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-3/4 animate-pulse bg-white/10" />
          <div className="h-3 w-1/2 animate-pulse bg-white/10" />
          <div className="h-3 w-2/3 animate-pulse bg-white/10" />
        </div>
      </div>
    </main>
  );
}
