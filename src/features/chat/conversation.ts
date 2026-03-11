export type ConversationType = "user" | "group" | "room" | "unknown";

export type ChatConversation = {
  id: string;
  type: ConversationType;
  title: string;
  imageUrl?: string | null;
  replyTargetId?: string | null;
  canSend: boolean;
  lastMessageText?: string;
  lastMessageTimestamp?: number;
  lastMessageFrom?: "user" | "line";
};
