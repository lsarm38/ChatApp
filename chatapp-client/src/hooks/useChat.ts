import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import type { Message } from "../types/index";
import { getRoomMessages } from "../api/room";

const HUB_URL =
  import.meta.env.VITE_HUB_URL ?? "http://localhost:5186/hubs/chat";

export function useChat(username: string, roomId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const typingTimeoutRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    // Incoming events
    connection.on("ReceiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    connection.on("UsersUpdated", (updatedUsers: string[]) => {
      setUsers(updatedUsers);
    });

    connection.on("UserJoined", (user: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          username: "System",
          content: `${user} joined the room`,
          sentAt: new Date().toISOString(),
          roomId,
        },
      ]);
    });

    connection.on("UserLeft", (user: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          username: "System",
          content: `${user} left the room`,
          sentAt: new Date().toISOString(),
          roomId,
        },
      ]);
    });

    connection.on("UserTyping", (user: string) => {
      setTypingUsers((prev) => (prev.includes(user) ? prev : [...prev, user]));
      if (typingTimeoutRef.current[user])
        clearTimeout(typingTimeoutRef.current[user]);
      typingTimeoutRef.current[user] = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u !== user));
      }, 3000);
    });

    connection.on("UserStoppedTyping", (user: string) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    });

    const start = async () => {
      try {
        await connection.start();
        connectionRef.current = connection;
        setConnected(true);

        // Load message history then join room
        const history = await getRoomMessages(roomId);
        setMessages(history);
        await connection.invoke("JoinRoom", username, roomId);
      } catch (err) {
        console.error("SignalR connection failed:", err);
      }
    };

    start();

    return () => {
      connection.invoke("LeaveRoom", roomId).catch(() => {});
      connection.stop();
    };
  }, [username, roomId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!connectionRef.current || !content.trim()) return;
      await connectionRef.current.invoke("SendMessage", roomId, content);
    },
    [roomId],
  );

  const sendTypingStarted = useCallback(async () => {
    if (!connectionRef.current) return;
    await connectionRef.current.invoke("TypingStarted", roomId);
  }, [roomId]);

  const sendTypingStopped = useCallback(async () => {
    if (!connectionRef.current) return;
    await connectionRef.current.invoke("TypingStopped", roomId);
  }, [roomId]);

  return {
    messages,
    users,
    typingUsers,
    connected,
    sendMessage,
    sendTypingStarted,
    sendTypingStopped,
  };
}
