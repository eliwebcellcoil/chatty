import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ---------- Agents ----------
  listAgents() {
    return this.prisma.agent.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        maxConcurrentChats: true,
        canHandleChat: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async createAgent(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    maxConcurrentChats?: number;
    canHandleChat?: boolean;
  }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.agent.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || "agent",
        maxConcurrentChats: data.maxConcurrentChats ?? 3,
        canHandleChat: data.canHandleChat ?? true,
        status: "offline",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        maxConcurrentChats: true,
        canHandleChat: true,
      },
    });
  }

  async updateAgent(
    id: string,
    data: {
      name?: string;
      role?: string;
      maxConcurrentChats?: number;
      canHandleChat?: boolean;
      status?: string;
      password?: string;
    }
  ) {
    const update: any = { ...data };
    delete update.password;
    if (data.password) {
      update.passwordHash = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.agent.update({
      where: { id },
      data: update,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        maxConcurrentChats: true,
        canHandleChat: true,
      },
    });
  }

  // ---------- Canned content ----------
  listCanned(language?: string) {
    return this.prisma.cannedResponse.findMany({
      where: language ? { language } : undefined,
      orderBy: [{ language: "asc" }, { title: "asc" }],
    });
  }

  createCanned(data: { title: string; content: string; language?: string; category?: string }) {
    return this.prisma.cannedResponse.create({
      data: {
        title: data.title,
        content: data.content,
        language: data.language || "he",
        category: data.category,
      },
    });
  }

  updateCanned(
    id: string,
    data: { title?: string; content?: string; language?: string; category?: string }
  ) {
    return this.prisma.cannedResponse.update({ where: { id }, data });
  }

  deleteCanned(id: string) {
    return this.prisma.cannedResponse.delete({ where: { id } });
  }

  // ---------- Analytics ----------
  async getAnalytics() {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalConversations,
      openConversations,
      closedConversations,
      unassigned,
      totalMessages,
      surveys,
      agentsOnline,
      agentsTotal,
      last24h,
      last7d,
    ] = await Promise.all([
      this.prisma.conversation.count(),
      this.prisma.conversation.count({ where: { status: "open" } }),
      this.prisma.conversation.count({ where: { status: "closed" } }),
      this.prisma.conversation.count({ where: { status: "open", assignedAgentId: null } }),
      this.prisma.message.count({ where: { isInternal: false } }),
      this.prisma.survey.findMany({ select: { rating: true } }),
      this.prisma.agent.count({ where: { status: "online" } }),
      this.prisma.agent.count(),
      this.prisma.conversation.count({ where: { createdAt: { gte: dayAgo } } }),
      this.prisma.conversation.count({ where: { createdAt: { gte: weekAgo } } }),
    ]);

    const avgRating =
      surveys.length > 0
        ? Math.round((surveys.reduce((s, x) => s + x.rating, 0) / surveys.length) * 10) / 10
        : null;

    const ratingDistribution = [1, 2, 3, 4, 5].map((r) => ({
      rating: r,
      count: surveys.filter((s) => s.rating === r).length,
    }));

    // Simple response time proxy: not tracking first response yet – placeholder counts
    return {
      conversations: {
        total: totalConversations,
        open: openConversations,
        closed: closedConversations,
        unassigned,
        last24h,
        last7d,
      },
      messages: { total: totalMessages },
      surveys: {
        count: surveys.length,
        avgRating,
        distribution: ratingDistribution,
      },
      agents: {
        total: agentsTotal,
        online: agentsOnline,
      },
      generatedAt: now.toISOString(),
    };
  }
}
