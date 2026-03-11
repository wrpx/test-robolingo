"use client";

import { useQuery } from "@tanstack/react-query";
import { EMPTY_INBOX, inboxQueryKey } from "@/features/chat/cache";
import { fetchChatInbox } from "@/features/chat/services/chat-service";

const MESSAGE_POLL_INTERVAL_MS = 3000;

export function useChatInbox() {
  const inboxQuery = useQuery({
    queryKey: inboxQueryKey,
    queryFn: ({ signal }) => fetchChatInbox(signal),
    initialData: EMPTY_INBOX,
    refetchInterval: MESSAGE_POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    conversations: inboxQuery.data.conversations,
    messages: inboxQuery.data.messages,
  };
}
