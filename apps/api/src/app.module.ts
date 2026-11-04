import { Module, OnModuleInit, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { RateLimitMiddleware } from "./common/rate-limit.middleware";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthController } from "./health.controller";
import { ConversationsController } from "./modules/conversations/conversations.controller";
import { ConversationsService } from "./modules/conversations/conversations.service";
import { MessagesController } from "./modules/messages/messages.controller";
import { MessagesService } from "./modules/messages/messages.service";
import { CannedController } from "./modules/canned/canned.controller";
import { CannedService } from "./modules/canned/canned.service";
import { SurveysController } from "./modules/surveys/surveys.controller";
import { SurveysService } from "./modules/surveys/surveys.service";
import { AuthController } from "./modules/auth/auth.controller";
import { AuthService } from "./modules/auth/auth.service";
import { AuthGuard } from "./modules/auth/auth.guard";
import { QueueController } from "./modules/queue/queue.controller";
import { QueueService } from "./modules/queue/queue.service";
import { AdminController } from "./modules/admin/admin.controller";
import { AdminService } from "./modules/admin/admin.service";
import { ShiftService } from "./modules/admin/shift.service";

@Module({
  imports: [PrismaModule],
  controllers: [
    HealthController,
    ConversationsController,
    MessagesController,
    CannedController,
    SurveysController,
    AuthController,
    QueueController,
    AdminController,
  ],
  providers: [
    ConversationsService,
    MessagesService,
    CannedService,
    SurveysService,
    AuthService,
    AuthGuard,
    QueueService,
    AdminService,
    ShiftService,
  ],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(private auth: AuthService) {}

  async onModuleInit() {
    await this.auth.ensureDefaultAdmin();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes("*");
  }
}
