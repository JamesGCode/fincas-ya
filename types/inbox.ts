export type InboxStatus = "human" | "ai" | "resolved";
export type InboxPriority = "urgent" | "high" | "medium" | "low";
export type MessageType = "text" | "image" | "audio" | "document" | "video";

export interface Contact {
  name: string;
  phone: string;
}

export interface Conversation {
  _id: string;
  _creationTime: number;
  channel: string; // Ej: "whatsapp"
  contact: Contact;
  lastMessageAt: number;
  lastMessagePreview?: string;
  priority: InboxPriority;
  propertyId?: string;
  propertyTitle?: string;
  status: InboxStatus;
  updatedAt: number;
  unreadCount?: number;
}

export interface PaginationResult<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface MessageSender {
  role: "user" | "assistant" | "system";
  name?: string;
}

export interface Message {
  _id: string;
  _creationTime: number;
  conversationId: string;
  sender: MessageSender;
  text?: string;
  type: MessageType;
  mediaUrl?: string;
  read: boolean;
  metadata?: Record<string, any>;
}

export interface SendMessagePayload {
  text?: string;
  type: MessageType;
  file?: File;
}
