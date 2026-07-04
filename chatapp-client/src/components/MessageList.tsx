import { useEffect, useRef } from "react";
import type { Message } from "../types/index.ts";

interface Props {
  messages: Message[];
  currentUser: string;
  typingUsers: string[];
}

export default function MessageList({
  messages,
  currentUser,
  typingUsers,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {messages.map((msg) => {
        const isSystem = msg.username === "System";
        const isOwn = msg.username === currentUser;

        if (isSystem)
          return (
            <div key={msg.id} className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-xs text-gray-600 italic shrink-0">
                {msg.content}
              </span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
          );

        return (
          <div
            key={msg.id}
            className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isOwn ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {msg.username[0].toUpperCase()}
            </div>

            <div
              className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? "items-end" : "items-start"}`}
            >
              <div
                className={`flex items-baseline gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-xs font-medium ${isOwn ? "text-blue-400" : "text-gray-400"}`}
                >
                  {msg.username}
                </span>
                <span className="text-xs text-gray-600">
                  {new Date(msg.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isOwn
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-gray-800 text-gray-200 rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        );
      })}

      {typingUsers.length > 0 && (
        <div className="flex gap-3 items-end">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold shrink-0">
            {typingUsers[0][0].toUpperCase()}
          </div>
          <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
            <div className="flex gap-1 items-center">
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-500 mb-1">
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
            typing
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
