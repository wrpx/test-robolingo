import { MAX_MESSAGE_LENGTH } from "@/features/chat/constants";

interface ChatComposerProps {
  draft: string;
  error: string;
  isSending: boolean;
  canSend: boolean;
  placeholder?: string;
  onDraftChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ChatComposer({
  draft,
  error,
  isSending,
  canSend,
  placeholder = "Type a message",
  onDraftChange,
  onSubmit,
}: ChatComposerProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-black/8 bg-[linear-gradient(180deg,#eef1f4_0%,#e7ebef_100%)] p-3 sm:p-4"
    >
      <div className="flex items-end gap-3">
        <textarea
          id="message"
          rows={1}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          disabled={!canSend}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder={placeholder}
          className="max-h-40 min-h-12 flex-1 resize-none rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        />
        <button
          type="submit"
          disabled={!canSend || isSending || !draft.trim()}
          className="inline-flex h-12 min-w-24 items-center justify-center rounded-full bg-[#0b8457] px-5 text-sm font-semibold text-white transition hover:bg-[#086c47] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
      <div className="mt-2 text-right text-xs text-slate-500">
        {draft.length}/{MAX_MESSAGE_LENGTH}
      </div>
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </form>
  );
}
