import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export interface StoredMessage {
  text: string;
  from: "user" | "line";
  timestamp: number;
}

// In-memory store (resets on redeploy — fine for demo)
export const messages: StoredMessage[] = [];

function verifySignature(body: string, signature: string): boolean {
  const hash = crypto
    .createHmac("SHA256", process.env.LINE_CHANNEL_SECRET!)
    .update(body)
    .digest("base64");
  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-line-signature") || "";

    if (!verifySignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const parsed = JSON.parse(body);

    for (const event of parsed.events || []) {
      if (event.type === "message" && event.message?.type === "text") {
        messages.push({
          text: event.message.text,
          from: "line",
          timestamp: event.timestamp,
        });
        if (messages.length > 100) messages.shift();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
