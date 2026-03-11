"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInboxCache } from "@/features/chat/cache";
import { sendChatMessage } from "@/features/chat/services/chat-service";

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      updateInboxCache(queryClient, data.message, data.conversation);
    },
  });
}
