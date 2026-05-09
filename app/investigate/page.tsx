export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { InvestigationRoom } from "@/components/investigation/investigation-room";

function Loading() {
  return (
    <main className="flex min-h-dvh items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-none border-2 border-white/10 border-t-[#4B4BA0]" />
        <p className="text-sm text-[#A1A1AA]">Loading investigation room...</p>
      </div>
    </main>
  );
}

export default function InvestigatePage() {
  return (
    <Suspense fallback={<Loading />}>
      <InvestigationRoom />
    </Suspense>
  );
}
