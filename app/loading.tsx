export default function Loading() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#0E0E0E] px-6 text-[#F4F1EA]">
      <div className="w-full max-w-lg border-2 border-[#3F3F3F] bg-[#161616] p-8">
        <p className="font-mono text-sm uppercase tracking-[0.1em] text-[#71706B]">
          Loading Case File&hellip;
        </p>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-3/4 animate-pulse bg-[#2A2A2A]" />
          <div className="h-3 w-1/2 animate-pulse bg-[#2A2A2A]" />
          <div className="h-3 w-2/3 animate-pulse bg-[#2A2A2A]" />
        </div>
      </div>
    </main>
  );
}
