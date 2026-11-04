import { Controller, Post, Body } from "@nestjs/common";
import { SurveysService } from "./surveys.service";

@Controller("surveys")
export class SurveysController {
  constructor(private readonly service: SurveysService) {}

  @Post()
  create(
    @Body()
    body: { conversationId: string; rating: number; comment?: string }
  ) {
    return this.service.create(body);
  }
}
