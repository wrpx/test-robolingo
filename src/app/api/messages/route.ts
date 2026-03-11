import { NextResponse } from "next/server";
import {
  getConversation,
  listConversations,
  listMessages,
  upsertConversation,
} from "@/server/chat-store";
import { getLineDefaultTargetId } from "@/server/line-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const defaultTargetId = getLineDefaultTargetId();

  if (defaultTargetId && !getConversation(defaultTargetId)) {
    upsertConversation({
      id: defaultTargetId,
      type: "unknown",
      title: "Configured target",
      replyTargetId: defaultTargetId,
      canSend: true,
    });
  }

  return NextResponse.json(
    {
      conversations: listConversations(),
      messages: listMessages(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
