import type { ChatConversation, ChatMessage } from "@/features/chat/types";
import { ChatAvatar } from "@/components/chat/chat-avatar";

interface ChatMessagesProps {
  conversation?: ChatConversation;
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

export function ChatMessages({ conversation, messages }: ChatMessagesProps) {
  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[linear-gradient(180deg,#ebe3d8_0%,#e3dacd_100%)] px-4 py-5 sm:px-5">
        <div className="max-w-sm rounded-[32px] border border-white/70 bg-white/80 p-8 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <p className="text-base font-semibold text-slate-900">ยังไม่ได้เลือกห้องแชท</p>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            เลือกห้องจากรายการด้านซ้ายเพื่อดูประวัติข้อความและตอบกลับในห้องนั้น
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#ebe3d8_0%,#e3dacd_100%)] px-4 py-5 sm:px-5">
      <div className="sticky top-0 z-10 -mx-2 rounded-3xl bg-white/70 px-4 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.05)] backdrop-blur">
        <div className="flex items-center gap-3">
          <ChatAvatar imageUrl={conversation.imageUrl} label={conversation.title} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {conversation.title}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {conversation.canSend ? "พร้อมตอบกลับ" : "ห้องนี้ตอบกลับจากหน้าเว็บไม่ได้"}
            </p>
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm leading-7 text-muted sm:min-h-70">
          ยังไม่มีข้อความในห้องนี้
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
                <div className={`flex max-w-[92%] gap-3 sm:max-w-[82%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                  {!isUser ? (
                    <ChatAvatar
                      imageUrl={message.sender?.pictureUrl}
                      label={message.sender?.displayName ?? "LINE user"}
                      size="sm"
                    />
                  ) : null}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      isUser
                        ? "bg-[#d9f5bf] text-slate-900 shadow-[0_6px_18px_rgba(120,160,90,0.18)]"
                        : "bg-[#fffdf9] text-slate-900 shadow-[0_6px_18px_rgba(15,23,42,0.08)]"
                    }`}
                  >
                    <p className="text-xs font-semibold tracking-[0.02em] text-slate-500">
                      {isUser ? "Webchat" : (message.sender?.displayName ?? "LINE user")}
                    </p>
                    <p className="mt-2 text-sm leading-6 whitespace-pre-wrap">{message.text}</p>
                    <p className="mt-2 text-right text-[11px] text-slate-400">
                      {formatMessageTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </>
      )}
    </div>
  );
}
