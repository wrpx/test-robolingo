import type { ConversationType } from "@/features/chat/conversation";

export type ChatSender = {
  lineUserId?: string;
  displayName: string;
  pictureUrl?: string | null;
};

export type ChatMessage = {
  id: string;
  text: string;
  from: "user" | "line";
  timestamp: number;
  conversationId: string;
  conversationType: ConversationType;
  sender?: ChatSender;
};
