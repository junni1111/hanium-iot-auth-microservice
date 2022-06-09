import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard extends AuthG {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    Logger.debug(`In Auth Guard: `, request);
    try {
      const jwt = request['authorization']?.split(' ')[1];
      const user = this.authService.validateToken(jwt);
      Logger.debug(`Validate Result: `, user);
      request.user = user;

      return user;
    } catch (e) {
      Logger.error(`Auth Guard Exception`, e);
      return false;
    }
  }
}
