import { Suspense } from "react";
import { InvestigationRoomV2 } from "@/components/investigation-v2/investigation-room-v2";

function Loading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0E0E0E] text-[#F4F1EA]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-none border-2 border-[#2A2A2A] border-t-[#34D399]" />
        <p className="text-sm text-[#8A857D]">Loading investigation room...</p>
      </div>
    </main>
  );
}

export default function InvestigateV3Page() {
  return (
    <Suspense fallback={<Loading />}>
      <InvestigationRoomV2 />
    </Suspense>
  );
}
