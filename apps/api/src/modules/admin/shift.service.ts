import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ShiftService {
  constructor(private prisma: PrismaService) {}

  async getShiftOverview() {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const agents = await this.prisma.agent.findMany({
      where: { canHandleChat: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        maxConcurrentChats: true,
      },
    });

    const agentStats = await Promise.all(
      agents.map(async (a) => {
        const openChats = await this.prisma.conversation.count({
          where: { assignedAgentId: a.id, status: "open" },
        });
        const closedToday = await this.prisma.conversation.count({
          where: {
            assignedAgentId: a.id,
            status: "closed",
            closedAt: { gte: startOfDay },
          },
        });
        return {
          ...a,
          openChats,
          closedToday,
          remainingCapacity: Math.max(0, a.maxConcurrentChats - openChats),
          utilization:
            a.maxConcurrentChats > 0
              ? Math.round((openChats / a.maxConcurrentChats) * 100)
              : 0,
        };
      })
    );

    const queueLength = await this.prisma.conversation.count({
      where: { status: "open", assignedAgentId: null },
    });

    const openTotal = await this.prisma.conversation.count({
      where: { status: "open" },
    });

    const closedToday = await this.prisma.conversation.count({
      where: { status: "closed", closedAt: { gte: startOfDay } },
    });

    const openedToday = await this.prisma.conversation.count({
      where: { createdAt: { gte: startOfDay } },
    });

    // Waiting time proxy: oldest unassigned open conversation age in minutes
    const oldestUnassigned = await this.prisma.conversation.findFirst({
      where: { status: "open", assignedAgentId: null },
      orderBy: { createdAt: "asc" },
    });
    const maxWaitMinutes = oldestUnassigned
      ? Math.round((now.getTime() - oldestUnassigned.createdAt.getTime()) / 60000)
      : 0;

    const surveysToday = await this.prisma.survey.findMany({
      where: { createdAt: { gte: startOfDay } },
      select: { rating: true },
    });
    const avgRatingToday =
      surveysToday.length > 0
        ? Math.round(
            (surveysToday.reduce((s, x) => s + x.rating, 0) / surveysToday.length) * 10
          ) / 10
        : null;

    const online = agentStats.filter((a) => a.status === "online");
    const away = agentStats.filter((a) => a.status === "away");
    const offline = agentStats.filter((a) => a.status === "offline");

    const routing = await this.prisma.appSetting.findUnique({
      where: { key: "routing_mode" },
    });

    return {
      generatedAt: now.toISOString(),
      routingMode: routing?.value || "pull",
      summary: {
        queueLength,
        openTotal,
        openedToday,
        closedToday,
        maxWaitMinutes,
        avgRatingToday,
        surveysToday: surveysToday.length,
        agentsOnline: online.length,
        agentsAway: away.length,
        agentsOffline: offline.length,
        totalCapacity: online.reduce((s, a) => s + a.maxConcurrentChats, 0),
        usedCapacity: online.reduce((s, a) => s + a.openChats, 0),
      },
      agents: agentStats.sort((a, b) => {
        const order = { online: 0, away: 1, offline: 2 };
        return (order[a.status as keyof typeof order] ?? 9) - (order[b.status as keyof typeof order] ?? 9);
      }),
      queuePreview: await this.prisma.conversation.findMany({
        where: { status: "open", assignedAgentId: null },
        orderBy: { createdAt: "asc" },
        take: 10,
        select: {
          id: true,
          customerName: true,
          isAnonymous: true,
          language: true,
          createdAt: true,
        },
      }),
    };
  }
}
