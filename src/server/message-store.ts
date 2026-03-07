import "server-only";

import type { ChatMessage } from "@/features/chat/types";

const MAX_STORED_MESSAGES = 200;
const messages: ChatMessage[] = [];
const messageIds = new Set<string>();

export function addMessage(message: ChatMessage) {
  if (messageIds.has(message.id)) {
    return;
  }

  messages.push(message);
  messageIds.add(message.id);

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
