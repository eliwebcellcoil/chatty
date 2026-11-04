import { Controller, Post, Body } from "@nestjs/common";
import { MessagesService } from "./messages.service";

@Controller("messages")
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Post()
  create(
    @Body()
    body: {
      conversationId: string;
      content: string;
      senderType: string;
      isInternal?: boolean;
    }
  ) {
    return this.service.create(body);
  }
}
