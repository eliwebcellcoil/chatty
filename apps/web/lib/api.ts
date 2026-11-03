const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function createConversation(data: {
  customerInfo?: { name?: string; email?: string; isAnonymous: boolean };
  language?: string;
}) {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function sendMessage(data: {
  conversationId: string;
  content: string;
  senderType: "customer" | "agent" | "system";
  isInternal?: boolean;
}) {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getConversation(id: string) {
  const res = await fetch(`${API_URL}/conversations/${id}`);
  return res.json();
}

export async function closeConversation(id: string) {
  const res = await fetch(`${API_URL}/conversations/${id}/close`, {
    method: "POST",
  });
  return res.json();
}

export async function submitSurvey(data: {
  conversationId: string;
  rating: number;
  comment?: string;
}) {
  const res = await fetch(`${API_URL}/surveys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
