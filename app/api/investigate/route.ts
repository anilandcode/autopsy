import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: "NotImplemented",
      message:
        "SSE investigation streaming is not implemented yet. Use /api/test to validate the foundation first.",
    },
    { status: 501 }
  );
}

