import { NextRequest, NextResponse } from "next/server";
import { validateSignature, type WebhookRequestBody } from "@line/bot-sdk";
import { addMessage, upsertConversation } from "@/server/message-store";
import { getLineWebhookConfig } from "@/server/line-config";
import {
  getConversationDescriptor,
  getConversationPresentation,
  getSenderProfile,
} from "@/server/line-profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let rawBody = "";

  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const signature = req.headers.get("x-line-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 401 });
  }

  try {
    const { channelSecret } = getLineWebhookConfig();

    if (!validateSignature(rawBody, channelSecret, signature)) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as WebhookRequestBody;

    for (const event of payload.events) {
      if (event.type !== "message" || event.message.type !== "text") {
        continue;
      }

      const descriptor = getConversationDescriptor(event.source, event.webhookEventId);
      const sender = await getSenderProfile(event.source);
      const presentation = await getConversationPresentation(
        event.source,
        descriptor,
        sender,
      );

      upsertConversation({
        id: descriptor.id,
        type: descriptor.type,
        title: presentation.title ?? descriptor.defaultTitle,
        imageUrl: presentation.imageUrl,
        replyTargetId: descriptor.replyTargetId,
        canSend: descriptor.canSend,
      });

      addMessage({
        id: event.webhookEventId,
        text: event.message.text,
        from: "line",
        timestamp: event.timestamp,
        conversationId: descriptor.id,
        conversationType: descriptor.type,
        sender:
          sender ??
          (event.source.userId
            ? {
                lineUserId: event.source.userId,
                displayName: `LINE user ${event.source.userId.slice(-6)}`,
              }
            : {
                displayName: "Unknown sender",
              }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LINE webhook error:", error);

    if (
      error instanceof Error &&
      error.message === "LINE webhook configuration is incomplete"
    ) {
      return NextResponse.json(
        { error: "LINE webhook configuration is incomplete." },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "Failed to process webhook." }, { status: 500 });
  }
}
