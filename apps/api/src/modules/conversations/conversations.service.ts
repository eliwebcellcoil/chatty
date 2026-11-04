import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { QueueService } from "../queue/queue.service";

@Injectable()
export class ConversationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => QueueService))
    private queue: QueueService,
  ) {}

  async findAll(status?: string, q?: string) {
    const where: any = {};
    if (status && status !== "all") where.status = status;
    if (q) {
      where.OR = [
        { id: { contains: q } },
        { customerName: { contains: q, mode: "insensitive" } },
        { customerEmail: { contains: q, mode: "insensitive" } },
      ];
    }
    return this.prisma.conversation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { assignedAgent: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        assignedAgent: { select: { id: true, name: true } },
        survey: true,
      },
    });
  }

  async create(data: {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerId?: string;
    isAnonymous?: boolean;
    language?: string;
  }) {
    const conv = await this.prisma.conversation.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerId: data.customerId,
        isAnonymous: data.isAnonymous ?? true,
        language: data.language || "he",
        status: "open",
      },
    });

    // Auto-assign if routing mode is auto
    try {
      const mode = await this.queue.getRoutingMode();
      if (mode === "auto") {
        const result = await this.queue.autoAssign(conv.id);
        if (result.assigned && result.conversation) return result.conversation;
      }
    } catch {}

    return conv;
  }

  async close(id: string) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          where: { isInternal: false },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!conv) return null;

    const updated = await this.prisma.conversation.update({
      where: { id },
      data: { status: "closed", closedAt: new Date() },
    });

    const lines = conv.messages.map((m) => {
      const who = m.senderType === "customer" ? "לקוח" : "נציג";
      return `[${m.createdAt.toLocaleString("he-IL")}] ${who}: ${m.content}`;
    });

    const customerLabel = conv.isAnonymous
      ? "אנונימי"
      : conv.customerName || conv.customerEmail || "לקוח";

    const transcriptFormatted = [
      "=== תמלול שיחה – Chatty ===",
      `מספר שיחה: ${conv.id}`,
      `לקוח: ${customerLabel}`,
      `שפה: ${conv.language}`,
      `נפתח: ${conv.createdAt.toLocaleString("he-IL")}`,
      `נסגר: ${updated.closedAt?.toLocaleString("he-IL")}`,
      "",
      ...lines,
      "",
      "=== סוף תמלול ===",
      "מוכן להעתקה ל-Dynamics 365 / CRM",
    ].join("\n");

    return {
      conversation: updated,
      transcript: lines.join("\n"),
      transcriptFormatted,
    };
  }
}
