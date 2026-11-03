import { Controller, Get } from "@nestjs/common";
import { getVersionString, APP_VERSION, BUILD_NUMBER, BUILD_DATE } from "../../../packages/shared/src";

@Controller()
export class HealthController {
  @Get("health")
  health() {
    return {
      status: "ok",
      version: APP_VERSION,
      build: BUILD_NUMBER,
      date: BUILD_DATE,
      message: getVersionString(),
    };
  }

  @Get()
  root() {
    return {
      name: "Chatty API",
      ...this.health(),
    };
  }
}
