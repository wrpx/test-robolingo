import type { ChatConversation } from "@/features/chat/conversation";
import { ChatAvatar } from "@/components/chat/chat-avatar";

interface ChatHeaderProps {
  conversationCount: number;
  selectedConversation?: ChatConversation;
  selectedMessageCount: number;
}

export function ChatHeader({
  conversationCount,
  selectedConversation,
  selectedMessageCount,
}: ChatHeaderProps) {
  return (
    <header className="border-b border-black/10 bg-[linear-gradient(135deg,#0b6b61_0%,#115e59_100%)] px-4 py-4 text-white sm:px-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {selectedConversation ? (
            <ChatAvatar
              imageUrl={selectedConversation.imageUrl}
              label={selectedConversation.title}
              size="lg"
            />
          ) : null}
          <div className="min-w-0">
            <p className="text-lg font-semibold">LINE OA Webchat</p>
            <p className="mt-1 truncate text-sm text-emerald-100">
              {selectedConversation
                ? `${selectedConversation.title} • ${selectedMessageCount} messages`
                : "เลือกห้องเพื่อดูและตอบกลับข้อความ"}
            </p>
          </div>
        </div>
        <div className="rounded-full bg-white/14 px-3 py-1 text-xs text-emerald-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
          {conversationCount} chats
        </div>
      </div>
    </header>
  );
}
