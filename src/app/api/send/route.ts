import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { MAX_MESSAGE_LENGTH } from "@/features/chat/constants";
import { sendLineTextMessage } from "@/server/send-line-message";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message =
    typeof payload === "object" && payload !== null && "message" in payload
      ? (payload as { message?: unknown }).message
      : undefined;

  if (typeof message !== "string") {
    return NextResponse.json({ error: "Message must be a string." }, { status: 400 });
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length === 0) {
    return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      {
        error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      },
      { status: 400 },
    );
  }

  try {
    await sendLineTextMessage(trimmedMessage);

    return NextResponse.json({
      success: true,
      message: {
        id: crypto.randomUUID(),
        text: trimmedMessage,
        from: "user",
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Send message error:", error);

    if (error instanceof Error && error.message === "LINE configuration is incomplete") {
      return NextResponse.json(
        {
          error: "LINE server configuration is incomplete.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Failed to send message to LINE. Please try again." },
      { status: 500 },
    );
  }
}
