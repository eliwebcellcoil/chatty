import { Controller, Get, Post, Param, Body, Query } from "@nestjs/common";
import { store } from "../../store";
import { Conversation, CustomerInfo } from "@chatty/shared";
import { randomUUID } from "crypto";

@Controller("conversations")
export class ConversationsController {
  @Get()
  findAll(@Query("q") q?: string, @Query("status") status?: string) {
    let list = [...store.conversations];
    if (status && status !== "all") {
      list = list.filter((c) => c.status === status);
    }
    if (q) {
      const lower = q.toLowerCase();
      list = list.filter(
        (c) =>
          c.id.includes(lower) ||
          c.customerInfo?.name?.toLowerCase().includes(lower) ||
          c.customerInfo?.email?.toLowerCase().includes(lower) ||
          c.tags?.some((t) => t.toLowerCase().includes(lower))
      );
    }
    return list.sort(
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

    const messages = store.messages
      .filter((m) => m.conversationId === id && !m.isInternal)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const lines = messages.map((m) => {
      const who = m.senderType === "customer" ? "לקוח" : "נציג";
      return `[${new Date(m.createdAt).toLocaleString("he-IL")}] ${who}: ${m.content}`;
    });

    const customerLabel = conv.customerInfo?.isAnonymous
      ? "אנונימי"
      : conv.customerInfo?.name || conv.customerInfo?.email || "לקוח";

    const transcriptFormatted = [
      "=== תמלול שיחה – Chatty ===",
      `מספר שיחה: ${conv.id}`,
      `לקוח: ${customerLabel}`,
      `שפה: ${conv.language}`,
      `נפתח: ${new Date(conv.createdAt).toLocaleString("he-IL")}`,
      `נסגר: ${new Date(conv.closedAt!).toLocaleString("he-IL")}`,
      "",
      ...lines,
      "",
      "=== סוף תמלול ===",
      "מוכן להעתקה ל-Dynamics 365 / CRM",
    ].join("\n");

    return {
      conversation: conv,
      transcript: lines.join("\n"),
      transcriptFormatted,
    };
  }
}
