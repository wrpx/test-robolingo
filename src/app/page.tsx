"use client";

import { FormEvent, useState } from "react";
import { ChatMessageInput } from "@/components/chat/chat-message-input";
import { ChatConversationList } from "@/components/chat/chat-conversation-list";
import { ChatHeader } from "@/components/chat/chat-header";
import { ConversationMessageList } from "@/components/chat/conversation-message-list";
import { MAX_MESSAGE_LENGTH } from "@/features/chat/constants";
import { useChatInbox } from "@/features/chat/hooks/use-chat-inbox";
import { useSendChatMessage } from "@/features/chat/hooks/use-send-chat-message";

export default function Home() {
  const { conversations, messages } = useChatInbox();
  const sendMessage = useSendChatMessage();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState("");

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ??
    conversations[0];
  const activeConversationId = selectedConversation?.id ?? "";
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

    if (!trimmedMessage || sendMessage.isPending) {
      return;
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      setError(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
      return;
    }

    setError("");

    try {
      const data = await sendMessage.mutateAsync({
        message: trimmedMessage,
        conversationId: activeConversation?.id,
      });
      setSelectedConversationId(data.conversation.id);
      setDraft("");
    } catch (sendError) {
      const message =
        sendError instanceof Error ? sendError.message : "Failed to send message.";
      setError(message);
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
            selectedConversationId={activeConversationId}
            onSelectConversation={setSelectedConversationId}
          />
          <div className="flex min-h-0 flex-1 flex-col">
            <ConversationMessageList
              conversation={selectedConversation}
              messages={visibleMessages}
            />
            <ChatMessageInput
              draft={draft}
              error={error}
              isSending={sendMessage.isPending}
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
