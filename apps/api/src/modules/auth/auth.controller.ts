import { Controller, Post, Body, Get, Headers } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }

  @Get("me")
  me(@Headers("authorization") authHeader?: string) {
    if (!authHeader?.startsWith("Bearer ")) {
      return { error: "Unauthorized" };
    }
    const payload = this.auth.verifyToken(authHeader.slice(7));
    if (!payload) return { error: "Unauthorized" };
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
