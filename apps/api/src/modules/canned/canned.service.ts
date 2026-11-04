import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CannedService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.cannedResponse.count();
    if (count === 0) {
      await this.prisma.cannedResponse.createMany({
        data: [
          { title: "שלום", content: "שלום! איך אוכל לעזור לך היום?", language: "he", category: "general" },
          { title: "תודה", content: "תודה שפנית אלינו. נשמח לעמוד לרשותך.", language: "he", category: "general" },
          { title: "בבדיקה", content: "אנחנו בודקים את הנושא וחוזרים אליך בהקדם.", language: "he", category: "status" },
          { title: "סגירה", content: "האם יש עוד משהו שאוכל לעזור בו לפני שנסיים?", language: "he", category: "close" },
          { title: "Hello", content: "Hello! How can I help you today?", language: "en", category: "general" },
          { title: "Thank you", content: "Thank you for contacting us. We are happy to assist.", language: "en", category: "general" },
          { title: "Looking into it", content: "We are looking into this and will get back to you shortly.", language: "en", category: "status" },
        ],
      });
    }
  }

  findAll(language?: string) {
    return this.prisma.cannedResponse.findMany({
      where: language ? { language } : undefined,
      orderBy: { title: "asc" },
    });
  }
}
