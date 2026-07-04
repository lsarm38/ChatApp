import { useState, useRef } from "react";

interface Props {
  onSend: (content: string) => void;
  onTypingStarted: () => void;
  onTypingStopped: () => void;
  disabled?: boolean;
}

export default function MessageInput({
  onSend,
  onTypingStarted,
  onTypingStopped,
  disabled,
}: Props) {
  const [value, setValue] = useState("");
  const typingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (!typingRef.current) {
      typingRef.current = true;
      onTypingStarted();
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      typingRef.current = false;
      onTypingStopped();
    }, 1500);
  };

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    typingRef.current = false;
    onTypingStopped();
  };

  return (
    <div className="px-6 py-4 border-t border-gray-800 bg-gray-950 shrink-0">
      <div className="flex gap-3 items-center">
        <input
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={disabled}
          placeholder={disabled ? "Connecting..." : "Type a message..."}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center shrink-0"
        >
          <svg
            className="w-4 h-4 rotate-90"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
