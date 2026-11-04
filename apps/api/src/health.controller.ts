import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

const APP_VERSION = "0.3.0";
const BUILD_NUMBER = "009";
const BUILD_DATE = "04.11.2026";

@Controller()
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get("health")
  async health() {
    let db = "unknown";
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      db = "ok";
    } catch {
      db = "error";
    }
    return {
      status: "ok",
      version: APP_VERSION,
      build: BUILD_NUMBER,
      date: BUILD_DATE,
      database: db,
      message: `Chatty Ver. ${APP_VERSION} | Build ${BUILD_NUMBER} | ${BUILD_DATE}`,
    };
  }

  @Get()
  root() {
    return this.health();
  }
}
