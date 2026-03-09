import type { ChatConversation } from "@/features/chat/types";
import { ChatAvatar } from "@/components/chat/chat-avatar";

interface ChatConversationListProps {
  conversations: ChatConversation[];
  selectedConversationId: string;
  onSelectConversation: (conversationId: string) => void;
}

function formatPreviewTimestamp(timestamp?: number) {
  if (!timestamp) {
    return "";
  }

  return new Date(timestamp).toLocaleString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
}

function getConversationTypeLabel(type: ChatConversation["type"]) {
  switch (type) {
    case "user":
      return "1:1";
    case "group":
      return "Group";
    case "room":
      return "Room";
    default:
      return "Target";
  }
}

export function ChatConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ChatConversationListProps) {
  return (
    <aside className="border-b border-black/8 bg-[linear-gradient(180deg,#f5f6f7_0%,#eef2f4_100%)] lg:w-[320px] lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between px-4 pb-3 pt-4 sm:px-5 lg:px-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Chats</p>
          <p className="mt-1 text-xs text-slate-500">เลือกห้องที่ต้องการตอบกลับ</p>
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.15)]">
          {conversations.length}
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="px-4 pb-4 sm:px-5 lg:px-4">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-5 text-sm leading-6 text-slate-500">
            ยังไม่มีห้องแชทเข้ามา ระบบจะสร้างห้องให้อัตโนมัติเมื่อมีข้อความจาก LINE
          </div>
        </div>
      ) : (
        <div className="flex max-h-[280px] flex-col gap-2 overflow-y-auto px-3 pb-4 sm:px-4 lg:max-h-none lg:px-3">
          {conversations.map((conversation) => {
            const isSelected = conversation.id === selectedConversationId;

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={`flex items-start gap-3 rounded-3xl border px-3 py-3 text-left transition ${
                  isSelected
                    ? "border-[#0b6b61]/30 bg-[#ddf1ec] shadow-[0_16px_30px_rgba(11,107,97,0.12)]"
                    : "border-transparent bg-white/80 hover:border-slate-200 hover:bg-white"
                }`}
              >
                <ChatAvatar
                  imageUrl={conversation.imageUrl}
                  label={conversation.title}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {conversation.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {getConversationTypeLabel(conversation.type)}
                        {!conversation.canSend ? " • reply unavailable" : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400">
                      {formatPreviewTimestamp(conversation.lastMessageTimestamp)}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
                    {conversation.lastMessageText || "ยังไม่มีข้อความในห้องนี้"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}
