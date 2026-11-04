import { Module } from "@nestjs/common";
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

@Module({
  imports: [PrismaModule],
  controllers: [
    HealthController,
    ConversationsController,
    MessagesController,
    CannedController,
    SurveysController,
  ],
  providers: [
    ConversationsService,
    MessagesService,
    CannedService,
    SurveysService,
  ],
})
export class AppModule {}
