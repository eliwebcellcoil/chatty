import { Controller, Post, Body } from "@nestjs/common";
import { store } from "../../store";
import { Message, SenderType } from "../../../../packages/shared/src";
import { randomUUID } from "crypto";

@Controller("messages")
export class MessagesController {
  @Post()
  create(
    @Body()
    body: {
      conversationId: string;
      content: string;
      senderType: SenderType;
      isInternal?: boolean;
    }
  ) {
    const conv = store.conversations.find((c) => c.id === body.conversationId);
    if (!conv) return { error: "Conversation not found" };
    if (conv.status === "closed") return { error: "Conversation is closed" };

    const message: Message = {
      id: randomUUID(),
      conversationId: body.conversationId,
      senderType: body.senderType,
      content: body.content,
      isInternal: body.isInternal || false,
      createdAt: new Date().toISOString(),
    };
    store.messages.push(message);
    return message;
  }
}
