"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatConversationList } from "@/components/chat/chat-conversation-list";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MAX_MESSAGE_LENGTH } from "@/features/chat/constants";
import type { SendResponse } from "@/features/chat/types";
import { useChatInbox } from "@/features/chat/use-chat-messages";

export default function Home() {
  const { addSentMessage, conversations, messages } = useChatInbox();
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState("");

  useEffect(() => {
    if (selectedConversationId && conversations.some((item) => item.id === selectedConversationId)) {
      return;
    }

    setSelectedConversationId(conversations[0]?.id ?? "");
  }, [conversations, selectedConversationId]);

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ??
    conversations[0];
  const visibleMessages = selectedConversation
    ? messages.filter((message) => message.conversationId === selectedConversation.id)
    : [];

  function handleDraftChange(value: string) {
    setDraft(value);

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = draft.trim();
    const activeConversation = selectedConversation;

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
        body: JSON.stringify({
          message: trimmedMessage,
          conversationId: activeConversation?.id,
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(errorPayload?.error ?? "Failed to send message.");
      }

      const data = (await response.json()) as SendResponse;

      addSentMessage(data.message, data.conversation);
      setSelectedConversationId(data.conversation.id);
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
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col overflow-hidden bg-[#f8f7f4] shadow-[0_20px_60px_rgba(15,23,42,0.16)] sm:h-[min(860px,calc(100vh-3rem))] sm:min-h-0 sm:rounded-[28px] sm:border sm:border-white/60">
        <ChatHeader
          conversationCount={conversations.length}
          selectedConversation={selectedConversation}
          selectedMessageCount={visibleMessages.length}
        />
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <ChatConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id ?? ""}
            onSelectConversation={setSelectedConversationId}
          />
          <div className="flex min-h-0 flex-1 flex-col">
            <ChatMessages conversation={selectedConversation} messages={visibleMessages} />
            <ChatComposer
              draft={draft}
              error={error}
              isSending={isSending}
              canSend={selectedConversation?.canSend ?? false}
              placeholder={
                selectedConversation?.canSend
                  ? `Reply to ${selectedConversation.title}`
                  : "Select a chat room to start replying"
              }
              onDraftChange={handleDraftChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
