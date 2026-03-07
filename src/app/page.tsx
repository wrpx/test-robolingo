"use client";

import { FormEvent, useState } from "react";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MAX_MESSAGE_LENGTH } from "@/features/chat/constants";
import type { ChatMessage, SendResponse } from "@/features/chat/types";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = draft.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      setError(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
      return;
    }

    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(errorPayload?.error ?? "Failed to send message.");
      }

      const data = (await response.json()) as SendResponse;

      setMessages((currentMessages) => [...currentMessages, data.message]);
      setDraft("");
    } catch (sendError) {
      const message =
        sendError instanceof Error ? sendError.message : "Failed to send message.";
      setError(message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ddd7cf_0%,#cfc7bd_100%)] px-0 py-0 text-foreground sm:px-4 sm:py-6">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col overflow-hidden bg-[#f8f7f4] shadow-[0_20px_60px_rgba(15,23,42,0.16)] sm:h-[min(760px,calc(100vh-3rem))] sm:min-h-0 sm:rounded-[28px] sm:border sm:border-white/60">
        <ChatHeader messageCount={messages.length} />
        <ChatMessages messages={messages} />
        <ChatComposer
          draft={draft}
          error={error}
          isSending={isSending}
          onDraftChange={(value) => {
            setDraft(value);
            if (error) {
              setError("");
            }
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}
