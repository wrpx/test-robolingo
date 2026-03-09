import "server-only";

import type {
  ChatConversation,
  ChatMessage,
  ConversationType,
} from "@/features/chat/types";

const MAX_STORED_MESSAGES = 200;
const messages: ChatMessage[] = [];
const messageIds = new Set<string>();
const conversations = new Map<string, ChatConversation>();

type ConversationInput = {
  id: string;
  type?: ConversationType;
  title?: string;
  imageUrl?: string | null;
  replyTargetId?: string;
  canSend?: boolean;
};

function getFallbackConversationTitle(type: ConversationType, id: string) {
  const shortId = id.slice(-6);

  switch (type) {
    case "user":
      return `LINE user ${shortId}`;
    case "group":
      return `LINE group ${shortId}`;
    case "room":
      return `LINE room ${shortId}`;
    default:
      return "Configured target";
  }
}

export function upsertConversation(input: ConversationInput) {
  const currentConversation = conversations.get(input.id);
  const type = input.type ?? currentConversation?.type ?? "unknown";

  const nextConversation: ChatConversation = {
    id: input.id,
    type,
    title:
      input.title ??
      currentConversation?.title ??
      getFallbackConversationTitle(type, input.id),
    imageUrl:
      input.imageUrl !== undefined
        ? input.imageUrl
        : (currentConversation?.imageUrl ?? null),
    replyTargetId:
      input.replyTargetId ?? currentConversation?.replyTargetId ?? null,
    canSend:
      input.canSend ??
      currentConversation?.canSend ??
      Boolean(input.replyTargetId ?? currentConversation?.replyTargetId),
    lastMessageText: currentConversation?.lastMessageText,
    lastMessageTimestamp: currentConversation?.lastMessageTimestamp,
    lastMessageFrom: currentConversation?.lastMessageFrom,
  };

  conversations.set(input.id, nextConversation);

  return nextConversation;
}

export function addMessage(message: ChatMessage) {
  if (messageIds.has(message.id)) {
    return;
  }

  const conversation =
    conversations.get(message.conversationId) ??
    upsertConversation({
      id: message.conversationId,
      type: message.conversationType,
      replyTargetId: message.conversationType === "unknown" ? undefined : message.conversationId,
      canSend: message.conversationType !== "unknown",
    });

  messages.push(message);
  messageIds.add(message.id);

  conversations.set(message.conversationId, {
    ...conversation,
    type: message.conversationType,
    lastMessageText: message.text,
    lastMessageTimestamp: message.timestamp,
    lastMessageFrom: message.from,
  });

  while (messages.length > MAX_STORED_MESSAGES) {
    const removedMessage = messages.shift();

    if (removedMessage) {
      messageIds.delete(removedMessage.id);
    }
  }
}

export function listMessages() {
  return [...messages].sort((left, right) => left.timestamp - right.timestamp);
}

export function listConversations() {
  return [...conversations.values()].sort((left, right) => {
    const rightTimestamp = right.lastMessageTimestamp ?? 0;
    const leftTimestamp = left.lastMessageTimestamp ?? 0;

    if (rightTimestamp !== leftTimestamp) {
      return rightTimestamp - leftTimestamp;
    }

    return left.title.localeCompare(right.title);
  });
}

export function getConversation(id: string) {
  return conversations.get(id);
}
