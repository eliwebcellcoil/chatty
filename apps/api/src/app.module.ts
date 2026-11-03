import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { ConversationsController } from "./modules/conversations/conversations.controller";
import { MessagesController } from "./modules/messages/messages.controller";
import { CannedController } from "./modules/canned/canned.controller";

@Module({
  imports: [],
  controllers: [
    HealthController,
    ConversationsController,
    MessagesController,
    CannedController,
  ],
  providers: [],
})
export class AppModule {}
