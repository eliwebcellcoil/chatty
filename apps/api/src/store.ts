import { Conversation, Message, CannedResponse, Survey, Agent } from "@chatty/shared";

export const store = {
  conversations: [] as Conversation[],
  messages: [] as Message[],
  canned: [
    { id: "c1", title: "שלום", content: "שלום! איך אוכל לעזור לך היום?", language: "he", category: "general" },
    { id: "c2", title: "תודה", content: "תודה שפנית אלינו. נשמח לעמוד לרשותך.", language: "he", category: "general" },
    { id: "c3", title: "בבדיקה", content: "אנחנו בודקים את הנושא וחוזרים אליך בהקדם.", language: "he", category: "status" },
    { id: "c4", title: "סגירה", content: "האם יש עוד משהו שאוכל לעזור בו לפני שנסיים?", language: "he", category: "close" },
    { id: "c5", title: "Hello", content: "Hello! How can I help you today?", language: "en", category: "general" },
    { id: "c6", title: "Thank you", content: "Thank you for contacting us. We are happy to assist.", language: "en", category: "general" },
    { id: "c7", title: "Looking into it", content: "We are looking into this and will get back to you shortly.", language: "en", category: "status" },
  ] as CannedResponse[],
  surveys: [] as Survey[],
  agents: [
    { id: "a1", name: "נציג ראשי", email: "agent@example.com", role: "admin" as const, status: "online" as const },
  ] as Agent[],
};
