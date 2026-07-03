// ─── Chat Conversation Model ─────────────────────────────────────────────────────

export type MessageSender = "user" | "admin";
export type MessageStatus = "pending" | "replied" | "resolved";
export type ConversationStatus = "open" | "resolved" | "closed";

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: Date;
  status: MessageStatus;
  read?: boolean;
  attachment?: string;
}

export interface ChatConversation {
  _id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageAt: Date;
  lastMessageBy: MessageSender;
  unreadCount: number;
  status: ConversationStatus;
  online?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to create a new conversation
export function createChatConversation(
  userId: string,
  userName: string,
  userEmail: string,
  avatarUrl?: string
): Omit<ChatConversation, "_id"> {
  const now = new Date();
  return {
    userId,
    userName,
    userEmail,
    avatarUrl,
    messages: [],
    lastMessage: "",
    lastMessageAt: now,
    lastMessageBy: "user",
    unreadCount: 0,
    status: "open",
    online: false,
    createdAt: now,
    updatedAt: now,
  };
}

// Helper function to create a new message
export function createChatMessage(
  sender: MessageSender,
  text: string,
  attachment?: string
): ChatMessage {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sender,
    text,
    timestamp: new Date(),
    status: sender === "user" ? "pending" : "replied",
    read: false,
    attachment,
  };
}
