export type ConversationStatus = "open" | "pending" | "closed";

export type SenderType = "customer" | "agent" | "system";

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  customerId?: string;
  isAnonymous: boolean;
}

export interface Conversation {
  id: string;
  status: ConversationStatus;
  customerInfo: CustomerInfo;
  language: string;
  assignedAgentId?: string;
  tags: string[];
  createdAt: string;
  closedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: SenderType;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface CannedResponse {
  id: string;
  title: string;
  content: string;
  language: string;
  category?: string;
}

export interface Survey {
  id: string;
  conversationId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: "agent" | "admin";
  status: "online" | "offline" | "busy";
}
