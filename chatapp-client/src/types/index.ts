export interface Room {
  id: number;
  name: string;
  description: string;
  onlineCount: number;
}

export interface Message {
  id: number;
  username: string;
  content: string;
  sentAt: string;
  roomId: number;
}
