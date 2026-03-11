import axios from "axios";
import type { InboxResponse, SendResponse } from "@/features/chat/api";

export type SendChatMessageInput = {
  message: string;
  conversationId?: string;
};

type ErrorPayload = {
  error?: string;
};

function getRequestErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<ErrorPayload>(error)) {
    return error.response?.data?.error ?? fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export async function fetchChatInbox(signal?: AbortSignal) {
  try {
    const { data } = await axios.get<InboxResponse>("/api/messages", {
      signal,
    });

    return data;
  } catch (error) {
    throw new Error(getRequestErrorMessage(error, "Failed to fetch inbox."));
  }
}

export async function sendChatMessage(input: SendChatMessageInput) {
  try {
    const { data } = await axios.post<SendResponse>("/api/send", input);

    return data;
  } catch (error) {
    throw new Error(getRequestErrorMessage(error, "Failed to send message."));
  }
}
