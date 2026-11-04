import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthService } from "../auth/auth.service";

// Inline permission check (shared package may not be resolved at runtime the same way)
const ROLE_PERMS: Record<string, string[]> = {
  super_admin: ["*"],
  admin: [
    "agents:view", "agents:manage", "canned:view", "canned:manage",
    "analytics:view", "settings:manage", "chat:handle", "queue:view",
  ],
  agent: ["chat:handle", "queue:view", "canned:view"],
  content: ["canned:view", "canned:manage"],
};

@Controller("admin")
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly auth: AuthService
  ) {}

  private require(authHeader: string | undefined, permission: string) {
    if (!authHeader?.startsWith("Bearer ")) throw new UnauthorizedException();
    const payload = this.auth.verifyToken(authHeader.slice(7));
    if (!payload) throw new UnauthorizedException();
    const perms = ROLE_PERMS[payload.role] || [];
    if (!perms.includes("*") && !perms.includes(permission)) {
      throw new ForbiddenException("Insufficient permissions");
    }
    return payload;
  }

  // Agents
  @Get("agents")
  listAgents(@Headers("authorization") auth?: string) {
    this.require(auth, "agents:view");
    return this.admin.listAgents();
  }

  @Post("agents")
  createAgent(
    @Headers("authorization") auth: string | undefined,
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      role?: string;
      maxConcurrentChats?: number;
      canHandleChat?: boolean;
    }
  ) {
    this.require(auth, "agents:manage");
    return this.admin.createAgent(body);
  }

  @Patch("agents/:id")
  updateAgent(
    @Headers("authorization") auth: string | undefined,
    @Param("id") id: string,
    @Body() body: any
  ) {
    this.require(auth, "agents:manage");
    return this.admin.updateAgent(id, body);
  }

  // Canned
  @Get("canned")
  listCanned(@Headers("authorization") auth?: string, @Query("language") language?: string) {
    this.require(auth, "canned:view");
    return this.admin.listCanned(language);
  }

  @Post("canned")
  createCanned(@Headers("authorization") auth: string | undefined, @Body() body: any) {
    this.require(auth, "canned:manage");
    return this.admin.createCanned(body);
  }

  @Patch("canned/:id")
  updateCanned(
    @Headers("authorization") auth: string | undefined,
    @Param("id") id: string,
    @Body() body: any
  ) {
    this.require(auth, "canned:manage");
    return this.admin.updateCanned(id, body);
  }

  @Delete("canned/:id")
  deleteCanned(@Headers("authorization") auth: string | undefined, @Param("id") id: string) {
    this.require(auth, "canned:manage");
    return this.admin.deleteCanned(id);
  }

  // Analytics
  @Get("analytics")
  analytics(@Headers("authorization") auth?: string) {
    this.require(auth, "analytics:view");
    return this.admin.getAnalytics();
  }

  // Roles reference
  @Get("roles")
  roles(@Headers("authorization") auth?: string) {
    this.require(auth, "agents:view");
    return {
      roles: [
        { id: "super_admin", label: "אדמין על", description: "כל ההרשאות" },
        { id: "admin", label: "אדמין", description: "ניהול נציגים, תוכן, אנליטיקה, הגדרות" },
        { id: "agent", label: "נציג", description: "טיפול בשיחות ותור" },
        { id: "content", label: "ניהול תוכן", description: "Canned Responses בלבד" },
      ],
      permissions: ROLE_PERMS,
    };
  }
}
