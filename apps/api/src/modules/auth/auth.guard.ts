import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header = req.headers["authorization"] as string | undefined;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException();
    }
    const payload = this.auth.verifyToken(header.slice(7));
    if (!payload) throw new UnauthorizedException();
    req.user = payload;
    return true;
  }
}
