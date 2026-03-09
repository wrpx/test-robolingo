export type ConversationType = "user" | "group" | "room" | "unknown";

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

export type SendResponse = {
  success: boolean;
  message: ChatMessage;
  conversation: ChatConversation;
};

export type InboxResponse = {
  conversations: ChatConversation[];
  messages: ChatMessage[];
};
