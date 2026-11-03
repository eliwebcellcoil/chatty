import { Controller, Post, Body } from "@nestjs/common";
import { store } from "../../store";
import { Survey } from "../../../../packages/shared/src";
import { randomUUID } from "crypto";

@Controller("surveys")
export class SurveysController {
  @Post()
  create(
    @Body()
    body: {
      conversationId: string;
      rating: number;
      comment?: string;
    }
  ) {
    const conv = store.conversations.find((c) => c.id === body.conversationId);
    if (!conv) return { error: "Conversation not found" };

    const survey: Survey = {
      id: randomUUID(),
      conversationId: body.conversationId,
      rating: Math.min(5, Math.max(1, body.rating)),
      comment: body.comment,
      createdAt: new Date().toISOString(),
    };
    store.surveys.push(survey);
    return survey;
  }
}
