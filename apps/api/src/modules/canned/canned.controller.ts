import { Controller, Get, Query } from "@nestjs/common";
import { store } from "../../store";

@Controller("canned-responses")
export class CannedController {
  @Get()
  findAll(@Query("language") language?: string) {
    if (language) {
      return store.canned.filter((c) => c.language === language);
    }
    return store.canned;
  }
}
