import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { store } from "../../store";
import { Conversation, CustomerInfo } from "@chatty/shared";
import { randomUUID } from "crypto";

@Controller("conversations")
export class ConversationsController {
  @Get()
  findAll() {
    return store.conversations.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    const conv = store.conversations.find((c) => c.id === id);
    if (!conv) return { error: "Conversation not found" };
    const messages = store.messages
      .filter((m) => m.conversationId === id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return { ...conv, messages };
  }

  @Post()
  create(@Body() body: { customerInfo?: CustomerInfo; language?: string }) {
    const conversation: Conversation = {
      id: randomUUID(),
      status: "open",
      customerInfo: body.customerInfo || { isAnonymous: true },
      language: body.language || "he",
      tags: [],
      createdAt: new Date().toISOString(),
    };
    store.conversations.push(conversation);
    return conversation;
  }

  @Post(":id/close")
  close(@Param("id") id: string) {
    const conv = store.conversations.find((c) => c.id === id);
    if (!conv) return { error: "Conversation not found" };
    conv.status = "closed";
    conv.closedAt = new Date().toISOString();

    // Build transcript
    const messages = store.messages
      .filter((m) => m.conversationId === id && !m.isInternal)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const transcript = messages
      .map((m) => {
        const who = m.senderType === "customer" ? "לקוח" : "נציג";
        return `[${new Date(m.createdAt).toLocaleString("he-IL")}] ${who}: ${m.content}`;
      })
      .join("\n");

    return {
      conversation: conv,
      transcript,
      transcriptFormatted: `=== תמלול שיחה ===\nמספר: ${conv.id}\nתאריך: ${conv.createdAt}\nשפה: ${conv.language}\n\n${transcript}\n\n=== סוף תמלול ===`,
    };
  }
}
