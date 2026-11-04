import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "chatty-dev-secret-change-in-production";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async ensureDefaultAdmin() {
    const existing = await this.prisma.agent.findUnique({
      where: { email: "admin@chatty.local" },
    });
    if (!existing) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await this.prisma.agent.create({
        data: {
          name: "אדמין על",
          email: "admin@chatty.local",
          passwordHash,
          role: "super_admin",
          status: "online",
        },
      });
      console.log("Default admin created: admin@chatty.local / admin123");
    }
  }

  async login(email: string, password: string) {
    const agent = await this.prisma.agent.findUnique({ where: { email } });
    if (!agent) return { error: "Invalid credentials" };

    const ok = await bcrypt.compare(password, agent.passwordHash);
    if (!ok) return { error: "Invalid credentials" };

    await this.prisma.agent.update({
      where: { id: agent.id },
      data: { status: "online" },
    });

    const token = jwt.sign(
      { sub: agent.id, email: agent.email, role: agent.role },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return {
      token,
      agent: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
      },
    };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as {
        sub: string;
        email: string;
        role: string;
      };
    } catch {
      return null;
    }
  }
}
