import { Module, OnModuleInit } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";
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

@Module({
  imports: [PrismaModule],
  controllers: [
    HealthController,
    ConversationsController,
    MessagesController,
    CannedController,
    SurveysController,
    AuthController,
  ],
  providers: [
    ConversationsService,
    MessagesService,
    CannedService,
    SurveysService,
    AuthService,
    AuthGuard,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private auth: AuthService) {}

  async onModuleInit() {
    await this.auth.ensureDefaultAdmin();
  }
}
