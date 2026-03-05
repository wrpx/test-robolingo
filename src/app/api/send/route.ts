import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendLineTextMessage } from "@/server/send-line-message";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await sendLineTextMessage(message.trim());

    return NextResponse.json({
      success: true,
      message: {
        id: crypto.randomUUID(),
        text: message.trim(),
        from: "user",
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Send message error:", error);

    if (error instanceof Error && error.message === "LINE configuration is incomplete") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
