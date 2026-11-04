import { Controller, Get, Post, Body, Param, Query, Headers } from "@nestjs/common";
import { QueueService } from "./queue.service";
import { AuthService } from "../auth/auth.service";

@Controller("queue")
export class QueueController {
  constructor(
    private readonly queue: QueueService,
    private readonly auth: AuthService
  ) {}

  private agentIdFromAuth(authHeader?: string): string | null {
    if (!authHeader?.startsWith("Bearer ")) return null;
    const payload = this.auth.verifyToken(authHeader.slice(7));
    return payload?.sub || null;
  }

  @Get()
  getQueue() {
    return this.queue.getQueue();
  }

  @Get("agents")
  listAgents() {
    return this.queue.listAgents();
  }

  @Get("routing-mode")
  async getMode() {
    return { routingMode: await this.queue.getRoutingMode() };
  }

  @Post("routing-mode")
  setMode(@Body() body: { mode: "pull" | "auto" }) {
    return this.queue.setRoutingMode(body.mode === "auto" ? "auto" : "pull");
  }

  @Post("claim-next")
  async claimNext(@Headers("authorization") auth?: string) {
    const agentId = this.agentIdFromAuth(auth);
    if (!agentId) return { error: "Unauthorized" };
    return this.queue.claimNext(agentId);
  }

  @Post("claim/:conversationId")
  async claimSpecific(
    @Param("conversationId") conversationId: string,
    @Headers("authorization") auth?: string
  ) {
    const agentId = this.agentIdFromAuth(auth);
    if (!agentId) return { error: "Unauthorized" };
    return this.queue.claimSpecific(agentId, conversationId);
  }

  @Post("transfer")
  async transfer(
    @Body() body: { conversationId: string; toAgentId: string },
    @Headers("authorization") auth?: string
  ) {
    const fromAgentId = this.agentIdFromAuth(auth) || undefined;
    return this.queue.transfer(body.conversationId, body.toAgentId, fromAgentId);
  }

  @Post("agent-status")
  async setStatus(
    @Body() body: { status: "online" | "away" | "offline" },
    @Headers("authorization") auth?: string
  ) {
    const agentId = this.agentIdFromAuth(auth);
    if (!agentId) return { error: "Unauthorized" };
    return this.queue.updateAgentStatus(agentId, body.status);
  }
}
