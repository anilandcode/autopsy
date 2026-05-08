export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { InvestigationRoom } from "@/components/investigation/investigation-room";

function Loading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0A0A0A] text-[#FAFAFA]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#222222] border-t-[#EF4444]" />
        <p className="text-sm text-[#71717A]">Loading investigation room...</p>
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
