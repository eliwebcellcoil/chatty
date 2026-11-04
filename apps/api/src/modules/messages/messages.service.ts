import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    conversationId: string;
    content: string;
    senderType: string;
    isInternal?: boolean;
  }) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: data.conversationId },
    });
    if (!conv) return { error: "Conversation not found" };
    if (conv.status === "closed") return { error: "Conversation is closed" };

    return this.prisma.message.create({
      data: {
        conversationId: data.conversationId,
        content: data.content,
        senderType: data.senderType,
        isInternal: data.isInternal || false,
      },
    });
  }
}
