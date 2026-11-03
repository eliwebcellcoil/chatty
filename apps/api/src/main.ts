import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { getVersionString } from "../../../packages/shared/src";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(3001);
  console.log(`Chatty API running on http://localhost:3001`);
  console.log(getVersionString());
}
bootstrap();
