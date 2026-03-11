import type { QueryClient } from "@tanstack/react-query";
import type { InboxResponse } from "@/features/chat/api";
import type { ChatConversation } from "@/features/chat/conversation";
import type { ChatMessage } from "@/features/chat/message";

export const EMPTY_INBOX: InboxResponse = {
  conversations: [],
  messages: [],
};
export const inboxQueryKey = ["chat-inbox"] as const;

function mergeMessages(currentMessages: ChatMessage[], nextMessages: ChatMessage[]) {
  const messagesById = new Map(currentMessages.map((message) => [message.id, message]));

  for (const message of nextMessages) {
    messagesById.set(message.id, message);
  }

  return [...messagesById.values()].sort((left, right) => left.timestamp - right.timestamp);
}

function mergeConversations(
  currentConversations: ChatConversation[],
  nextConversations: ChatConversation[],
) {
  const conversationsById = new Map(
    currentConversations.map((conversation) => [conversation.id, conversation]),
  );

  for (const conversation of nextConversations) {
    conversationsById.set(conversation.id, conversation);
  }

  return [...conversationsById.values()].sort((left, right) => {
    const rightTimestamp = right.lastMessageTimestamp ?? 0;
    const leftTimestamp = left.lastMessageTimestamp ?? 0;

    if (rightTimestamp !== leftTimestamp) {
      return rightTimestamp - leftTimestamp;
    }

    return left.title.localeCompare(right.title);
  });
}

export function updateInboxCache(
  queryClient: QueryClient,
  message: ChatMessage,
  conversation: ChatConversation,
) {
  queryClient.setQueryData<InboxResponse>(inboxQueryKey, (currentInbox) => {
    const inbox = currentInbox ?? EMPTY_INBOX;

    return {
      conversations: mergeConversations(inbox.conversations, [conversation]),
      messages: mergeMessages(inbox.messages, [message]),
    };
  });
}
