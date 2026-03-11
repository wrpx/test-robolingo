import type { ChatConversation } from "@/features/chat/conversation";
import type { ChatMessage } from "@/features/chat/message";

export type SendResponse = {
  success: boolean;
  message: ChatMessage;
  conversation: ChatConversation;
};

export type InboxResponse = {
  conversations: ChatConversation[];
  messages: ChatMessage[];
};
