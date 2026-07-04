import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRoom } from "../api/room";
import { useChat } from "../hooks/useChat.ts";
import MessageList from "../components/MessageList.tsx";
import MessageInput from "../components/MessageInput.tsx";
import UserList from "../components/UserList.tsx";
import type { Room } from "../types/index.ts";

export default function ChatRoom() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (id) getRoom(Number(id)).then(setRoom);
  }, [id]);

  if (!username) {
    navigate("/");
    return null;
  }

  const roomId = Number(id);
  const {
    messages,
    users,
    typingUsers,
    connected,
    sendMessage,
    sendTypingStarted,
    sendTypingStopped,
  } = useChat(username, roomId);

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-white transition-colors"
          >
            ←
          </button>
          <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-base">
            {room?.name === "General"
              ? "💬"
              : room?.name === "Tech Talk"
                ? "💻"
                : "🎲"}
          </div>
          <div>
            <h1 className="text-white font-semibold leading-tight">
              {room?.name ?? `Room #${id}`}
            </h1>
            <p className="text-xs text-gray-500 leading-tight">
              {connected ? (
                <span className="text-green-400">● Connected</span>
              ) : (
                <span className="text-yellow-400">● Connecting...</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            <span className="text-blue-400 font-medium">{username}</span>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          currentUser={username}
          typingUsers={typingUsers}
        />
        <UserList users={users} currentUser={username} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={sendMessage}
        onTypingStarted={sendTypingStarted}
        onTypingStopped={sendTypingStopped}
        disabled={!connected}
      />
    </div>
  );
}
