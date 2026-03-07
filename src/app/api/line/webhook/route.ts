import { NextRequest, NextResponse } from "next/server";
import { validateSignature, type WebhookRequestBody } from "@line/bot-sdk";
import { addMessage } from "@/server/message-store";
import { getLineWebhookConfig } from "@/server/line-config";

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

      addMessage({
        id: event.webhookEventId,
        text: event.message.text,
        from: "line",
        timestamp: event.timestamp,
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
