"use client";

import { useEffect, useEffectEvent, useState } from "react";
import type {
  ChatConversation,
  ChatMessage,
  InboxResponse,
} from "@/features/chat/types";

const MESSAGE_POLL_INTERVAL_MS = 3000;

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

async function fetchLatestInbox(signal?: AbortSignal) {
  try {
    const response = await fetch("/api/messages", {
      cache: "no-store",
      signal,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as InboxResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }

    return null;
  }
}

export function useChatInbox() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const syncInbox = useEffectEvent(async (signal?: AbortSignal) => {
    const nextInbox = await fetchLatestInbox(signal);

    if (!nextInbox) {
      return;
    }

    setConversations((currentConversations) =>
      mergeConversations(currentConversations, nextInbox.conversations),
    );
    setMessages((currentMessages) => mergeMessages(currentMessages, nextInbox.messages));
  });

  useEffect(() => {
    const initialRequest = new AbortController();
    const inFlightRequests = new Set<AbortController>();

    void syncInbox(initialRequest.signal);

    const intervalId = window.setInterval(() => {
      const request = new AbortController();
      inFlightRequests.add(request);

      void syncInbox(request.signal).finally(() => {
        inFlightRequests.delete(request);
      });
    }, MESSAGE_POLL_INTERVAL_MS);

    return () => {
      initialRequest.abort();

      for (const request of inFlightRequests) {
        request.abort();
      }

      window.clearInterval(intervalId);
    };
  }, []);

  function addSentMessage(message: ChatMessage, conversation: ChatConversation) {
    setMessages((currentMessages) => mergeMessages(currentMessages, [message]));
    setConversations((currentConversations) =>
      mergeConversations(currentConversations, [conversation]),
    );
  }

  return {
    addSentMessage,
    conversations,
    messages,
  };
}
