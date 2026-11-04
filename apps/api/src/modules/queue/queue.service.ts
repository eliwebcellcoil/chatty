import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class QueueService {
  constructor(private prisma: PrismaService) {}

  /** Get routing mode: pull | auto */
  async getRoutingMode(): Promise<"pull" | "auto"> {
    const s = await this.prisma.appSetting.findUnique({ where: { key: "routing_mode" } });
    return (s?.value as "pull" | "auto") || "pull";
  }

  async setRoutingMode(mode: "pull" | "auto") {
    await this.prisma.appSetting.upsert({
      where: { key: "routing_mode" },
      create: { key: "routing_mode", value: mode },
      update: { value: mode },
    });
    return { routingMode: mode };
  }

  /** Unassigned open conversations (general queue) */
  async getQueue() {
    return this.prisma.conversation.findMany({
      where: { status: "open", assignedAgentId: null },
      orderBy: { createdAt: "asc" },
    });
  }

  /** Count open chats per agent */
  async getAgentLoad(agentId: string) {
    return this.prisma.conversation.count({
      where: { assignedAgentId: agentId, status: "open" },
    });
  }

  /** Agents available for chat assignment */
  async getAvailableAgents() {
    const agents = await this.prisma.agent.findMany({
      where: { status: "online", canHandleChat: true },
    });
    const withLoad = await Promise.all(
      agents.map(async (a) => {
        const load = await this.getAgentLoad(a.id);
        return {
          ...a,
          passwordHash: undefined,
          currentLoad: load,
          remainingCapacity: Math.max(0, a.maxConcurrentChats - load),
        };
      })
    );
    return withLoad.filter((a) => a.remainingCapacity > 0);
  }

  /**
   * Agent pulls next conversation from general queue (if under capacity)
   */
  async claimNext(agentId: string) {
    const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent || agent.status !== "online" || !agent.canHandleChat) {
      return { error: "Agent not available for chat" };
    }
    const load = await this.getAgentLoad(agentId);
    if (load >= agent.maxConcurrentChats) {
      return { error: "Agent at full capacity", currentLoad: load, max: agent.maxConcurrentChats };
    }

    const next = await this.prisma.conversation.findFirst({
      where: { status: "open", assignedAgentId: null },
      orderBy: { createdAt: "asc" },
    });
    if (!next) return { error: "Queue is empty" };

    const updated = await this.prisma.conversation.update({
      where: { id: next.id },
      data: { assignedAgentId: agentId },
    });

    await this.prisma.message.create({
      data: {
        conversationId: next.id,
        senderType: "system",
        content: `השיחה שויכה לנציג ${agent.name}`,
        isInternal: true,
      },
    });

    return { conversation: updated };
  }

  /**
   * Claim a specific conversation from the queue
   */
  async claimSpecific(agentId: string, conversationId: string) {
    const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent || agent.status !== "online" || !agent.canHandleChat) {
      return { error: "Agent not available" };
    }
    const load = await this.getAgentLoad(agentId);
    if (load >= agent.maxConcurrentChats) {
      return { error: "Agent at full capacity" };
    }

    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv || conv.status !== "open") return { error: "Conversation not available" };
    if (conv.assignedAgentId && conv.assignedAgentId !== agentId) {
      return { error: "Already assigned to another agent" };
    }

    const updated = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { assignedAgentId: agentId },
    });

    await this.prisma.message.create({
      data: {
        conversationId,
        senderType: "system",
        content: `השיחה נלקחה על ידי ${agent.name}`,
        isInternal: true,
      },
    });

    return { conversation: updated };
  }

  /**
   * Transfer conversation to another agent
   */
  async transfer(conversationId: string, toAgentId: string, fromAgentId?: string) {
    const toAgent = await this.prisma.agent.findUnique({ where: { id: toAgentId } });
    if (!toAgent || !toAgent.canHandleChat) return { error: "Target agent cannot handle chat" };

    const load = await this.getAgentLoad(toAgentId);
    if (load >= toAgent.maxConcurrentChats) {
      return { error: "Target agent at full capacity" };
    }

    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv || conv.status === "closed") return { error: "Conversation not found or closed" };

    const updated = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { assignedAgentId: toAgentId },
    });

    await this.prisma.message.create({
      data: {
        conversationId,
        senderType: "system",
        content: `השיחה הועברה אל ${toAgent.name}`,
        isInternal: true,
      },
    });

    return { conversation: updated };
  }

  /**
   * Auto-assign to least-loaded online agent under capacity
   */
  async autoAssign(conversationId: string) {
    const available = await this.getAvailableAgents();
    if (available.length === 0) {
      return { assigned: false, reason: "No available agents" };
    }
    // Least loaded first, then oldest online by createdAt implicitly via order
    available.sort((a, b) => a.currentLoad - b.currentLoad);
    const target = available[0];

    const updated = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { assignedAgentId: target.id },
    });

    await this.prisma.message.create({
      data: {
        conversationId,
        senderType: "system",
        content: `שיוך אוטומטי אל ${target.name}`,
        isInternal: true,
      },
    });

    return { assigned: true, conversation: updated, agent: { id: target.id, name: target.name } };
  }

  async updateAgentStatus(agentId: string, status: "online" | "away" | "offline") {
    return this.prisma.agent.update({
      where: { id: agentId },
      data: { status },
      select: { id: true, name: true, email: true, status: true, maxConcurrentChats: true, canHandleChat: true },
    });
  }

  async listAgents() {
    const agents = await this.prisma.agent.findMany({
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
    return Promise.all(
      agents.map(async (a) => ({
        ...a,
        currentLoad: await this.getAgentLoad(a.id),
      }))
    );
  }
}
