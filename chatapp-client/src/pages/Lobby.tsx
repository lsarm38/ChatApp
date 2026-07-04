import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../api/room";
import type { Room } from "../types/index.ts";

export default function Lobby() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [username, setUsername] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getRooms().then((data) => {
      setRooms(data);
      setLoading(false);
    });
  }, []);

  const handleJoin = (roomId: number) => {
    if (!username.trim()) return;
    navigate(`/room/${roomId}`, { state: { username } });
  };

  if (!username) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">ChatApp</h1>
            <p className="text-gray-400 text-sm">
              Real-time chat powered by SignalR
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Choose a username
            </label>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && input.trim() && setUsername(input.trim())
              }
              placeholder="e.g. Grizz38"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <button
              onClick={() => input.trim() && setUsername(input.trim())}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
            >
              Enter ChatApp →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Chat Rooms</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Signed in as{" "}
              <span className="text-blue-400 font-medium">{username}</span>
            </p>
          </div>
          <button
            onClick={() => setUsername("")}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Switch user
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-800 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleJoin(room.id)}
                className="group bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-2xl p-6 flex items-center justify-between transition-all cursor-pointer hover:bg-gray-900/80"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-xl">
                    {room.name === "General"
                      ? "💬"
                      : room.name === "Tech Talk"
                        ? "💻"
                        : "🎲"}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {room.name}
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {room.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {room.onlineCount} online
                  </div>
                  <span className="px-4 py-2 bg-blue-600 group-hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                    Join →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
