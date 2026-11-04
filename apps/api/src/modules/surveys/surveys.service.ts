import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SurveysService {
  constructor(private prisma: PrismaService) {}

  async create(data: { conversationId: string; rating: number; comment?: string }) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: data.conversationId },
    });
    if (!conv) return { error: "Conversation not found" };

    return this.prisma.survey.create({
      data: {
        conversationId: data.conversationId,
        rating: Math.min(5, Math.max(1, data.rating)),
        comment: data.comment,
      },
    });
  }
}
