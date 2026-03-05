interface ChatHeaderProps {
  messageCount: number;
}

export function ChatHeader({ messageCount }: ChatHeaderProps) {
  return (
    <header className="border-b border-black/10 bg-[linear-gradient(135deg,#0b6b61_0%,#115e59_100%)] px-4 py-4 text-white sm:px-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">LINE OA Chat</p>
          <p className="mt-1 text-sm text-emerald-100">
            Send message to your official account flow
          </p>
        </div>
        <div className="rounded-full bg-white/14 px-3 py-1 text-xs text-emerald-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
          {messageCount} messages
        </div>
      </div>
    </header>
  );
}
