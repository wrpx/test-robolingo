import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { MAX_MESSAGE_LENGTH } from "@/features/chat/constants";
import { getLineDefaultTargetId } from "@/server/line-config";
import { addMessage, getConversation, upsertConversation } from "@/server/message-store";
import { sendLineTextMessage } from "@/server/send-line-message";
import type { ChatMessage } from "@/features/chat/types";

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
  const conversationId =
    typeof payload === "object" && payload !== null && "conversationId" in payload
      ? (payload as { conversationId?: unknown }).conversationId
      : undefined;

  if (typeof message !== "string") {
    return NextResponse.json({ error: "Message must be a string." }, { status: 400 });
  }

  if (conversationId !== undefined && typeof conversationId !== "string") {
    return NextResponse.json(
      { error: "Conversation ID must be a string." },
      { status: 400 },
    );
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
    const selectedConversation = conversationId ? getConversation(conversationId) : undefined;

    if (conversationId && !selectedConversation) {
      return NextResponse.json({ error: "Chat room not found." }, { status: 404 });
    }

    const defaultTargetId = getLineDefaultTargetId();
    const targetId = selectedConversation
      ? selectedConversation.replyTargetId
      : defaultTargetId;

    if (!targetId) {
      return NextResponse.json(
        { error: "Please select a chat room first." },
        { status: 400 },
      );
    }

    if (selectedConversation && !selectedConversation.canSend) {
      return NextResponse.json(
        { error: "This chat room cannot receive replies from the webchat." },
        { status: 400 },
      );
    }

    const resolvedConversation =
      selectedConversation ??
      getConversation(targetId) ??
      upsertConversation({
        id: targetId,
        type: "unknown",
        title: "Configured target",
        replyTargetId: targetId,
        canSend: true,
      });

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: trimmedMessage,
      from: "user",
      timestamp: Date.now(),
      conversationId: resolvedConversation.id,
      conversationType: resolvedConversation.type,
    };

    await sendLineTextMessage(trimmedMessage, targetId);
    addMessage(newMessage);

    return NextResponse.json({
      success: true,
      message: newMessage,
      conversation: getConversation(resolvedConversation.id) ?? resolvedConversation,
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
