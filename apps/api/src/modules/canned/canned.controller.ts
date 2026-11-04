import { Controller, Get, Query } from "@nestjs/common";
import { CannedService } from "./canned.service";

@Controller("canned-responses")
export class CannedController {
  constructor(private readonly service: CannedService) {}

  @Get()
  findAll(@Query("language") language?: string) {
    return this.service.findAll(language);
  }
}
