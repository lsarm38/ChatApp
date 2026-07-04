import client from "./client";
import type { Room, Message } from "../types/index";

export const getRooms = async (): Promise<Room[]> => {
  const { data } = await client.get("/rooms");
  return data;
};

export const getRoom = async (id: number): Promise<Room> => {
  const { data } = await client.get(`/rooms/${id}`);
  return data;
};

export const getRoomMessages = async (id: number): Promise<Message[]> => {
  const { data } = await client.get(`/rooms/${id}/messages`);
  return data;
};
