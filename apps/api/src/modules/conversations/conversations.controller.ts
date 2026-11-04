import { Controller, Get, Post, Param, Body, Query } from "@nestjs/common";
import { ConversationsService } from "./conversations.service";

@Controller("conversations")
export class ConversationsController {
  constructor(private readonly service: ConversationsService) {}

  @Get()
  findAll(@Query("q") q?: string, @Query("status") status?: string) {
    return this.service.findAll(status, q);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      customerInfo?: {
        name?: string;
        email?: string;
        phone?: string;
        customerId?: string;
        isAnonymous?: boolean;
      };
      language?: string;
    }
  ) {
    const info = body.customerInfo || {};
    return this.service.create({
      customerName: info.name,
      customerEmail: info.email,
      customerPhone: info.phone,
      customerId: info.customerId,
      isAnonymous: info.isAnonymous ?? true,
      language: body.language,
    });
  }

  @Post(":id/close")
  async close(@Param("id") id: string) {
    const result = await this.service.close(id);
    if (!result) return { error: "Conversation not found" };
    return result;
  }
}
