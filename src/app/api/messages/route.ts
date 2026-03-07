import { NextResponse } from "next/server";
import { listMessages } from "@/server/message-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { messages: listMessages() },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
