import type { ChatMessage } from "@/features/chat/types";

interface ChatMessagesProps {
  messages: ChatMessage[];
}

function formatMessageTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#ebe3d8_0%,#e3dacd_100%)] px-4 py-5 sm:px-5">
      <div className="text-center text-xs font-medium text-slate-500/90">Messages</div>

      {messages.length === 0 ? (
        <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm leading-7 text-muted sm:min-h-70">
          No messages yet. Send the first one.
        </div>
      ) : (
        <>
          {messages.map((message) => {
            const isUser = message.from === "user";

            return (
              <article
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%] ${
                    isUser
                      ? "bg-[#d9f5bf] text-slate-900 shadow-[0_6px_18px_rgba(120,160,90,0.18)]"
                      : "bg-[#fffdf9] text-slate-900 shadow-[0_6px_18px_rgba(15,23,42,0.08)]"
                  }`}
                >
                  <p className="text-sm leading-6 whitespace-pre-wrap">{message.text}</p>
                  <p className="mt-2 text-right text-[11px] text-slate-400">
                    {formatMessageTimestamp(message.timestamp)}
                  </p>
                </div>
              </article>
            );
          })}
        </>
      )}
    </div>
  );
}
