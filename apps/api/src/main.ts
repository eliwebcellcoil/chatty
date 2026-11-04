import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Chatty API running on http://localhost:${port}`);
  console.log(`Chatty Ver. 0.3.0 | Build 009 | 04.11.2026`);
}
bootstrap();
