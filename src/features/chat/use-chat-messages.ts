"use client";

import { useEffect, useEffectEvent, useState } from "react";
import type { ChatMessage, MessagesResponse } from "@/features/chat/types";

const MESSAGE_POLL_INTERVAL_MS = 3000;

function mergeMessages(currentMessages: ChatMessage[], nextMessages: ChatMessage[]) {
  const messagesById = new Map(currentMessages.map((message) => [message.id, message]));

  for (const message of nextMessages) {
    messagesById.set(message.id, message);
  }

  return [...messagesById.values()].sort((left, right) => left.timestamp - right.timestamp);
}

async function fetchLatestMessages(signal?: AbortSignal) {
  try {
    const response = await fetch("/api/messages", {
      cache: "no-store",
      signal,
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as MessagesResponse;
    return data.messages;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }

    return null;
  }
}

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const syncMessages = useEffectEvent(async (signal?: AbortSignal) => {
    const nextMessages = await fetchLatestMessages(signal);

    if (!nextMessages) {
      return;
    }

    setMessages((currentMessages) => mergeMessages(currentMessages, nextMessages));
  });

  useEffect(() => {
    const initialRequest = new AbortController();
    const inFlightRequests = new Set<AbortController>();

    void syncMessages(initialRequest.signal);

    const intervalId = window.setInterval(() => {
      const request = new AbortController();
      inFlightRequests.add(request);

      void syncMessages(request.signal).finally(() => {
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

  function addMessages(nextMessages: ChatMessage[]) {
    setMessages((currentMessages) => mergeMessages(currentMessages, nextMessages));
  }

  return {
    addMessages,
    messages,
  };
}
