import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) throw new UnauthorizedException('Unauthorized!');

    const data = await this.authService.validateToken(token);
    const { id, role, isActive, firstName, lastName, email, avatar } = data;
    request.user = {
      id,
      isActive,
      role,
      firstName,
      lastName,
      avatar,
      email,
    };

    return id ? (isActive ? true : false) : false;
  }
}
