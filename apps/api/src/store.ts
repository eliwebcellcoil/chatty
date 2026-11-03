import { Conversation, Message, CannedResponse, Survey, Agent } from "@chatty/shared";

export const store = {
  conversations: [] as Conversation[],
  messages: [] as Message[],
  canned: [
    {
      id: "c1",
      title: "שלום",
      content: "שלום! איך אוכל לעזור לך היום?",
      language: "he",
      category: "general",
    },
    {
      id: "c2",
      title: "Hello",
      content: "Hello! How can I help you today?",
      language: "en",
      category: "general",
    },
  ] as CannedResponse[],
  surveys: [] as Survey[],
  agents: [
    {
      id: "a1",
      name: "נציג ראשי",
      email: "agent@example.com",
      role: "admin" as const,
      status: "online" as const,
    },
  ] as Agent[],
};
