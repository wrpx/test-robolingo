export type ChatMessage = {
  id: string;
  text: string;
  from: "user" | "line";
  timestamp: number;
};

export type SendResponse = {
  success: boolean;
  message: ChatMessage;
};
