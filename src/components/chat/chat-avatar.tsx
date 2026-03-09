interface ChatAvatarProps {
  imageUrl?: string | null;
  label: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS_NAMES = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-12 w-12 text-sm",
};

function getInitials(label: string) {
  return label
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function ChatAvatar({
  imageUrl,
  label,
  size = "md",
}: ChatAvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={`shrink-0 rounded-full bg-[#d6efe9] bg-cover bg-center font-semibold text-[#0f5f57] ${SIZE_CLASS_NAMES[size]} flex items-center justify-center border border-white/70 shadow-[0_8px_20px_rgba(15,23,42,0.08)]`}
      style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
    >
      {imageUrl ? null : getInitials(label || "LI")}
    </div>
  );
}
