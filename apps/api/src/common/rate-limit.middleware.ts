import { Injectable, NestMiddleware, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 120; // per IP per minute

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
    const now = Date.now();
    let entry = hits.get(ip);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + WINDOW_MS };
      hits.set(ip, entry);
    }
    entry.count += 1;
    res.setHeader("X-RateLimit-Limit", String(MAX_REQUESTS));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, MAX_REQUESTS - entry.count)));
    if (entry.count > MAX_REQUESTS) {
      throw new HttpException("Too many requests", HttpStatus.TOO_MANY_REQUESTS);
    }
    next();
  }
}
