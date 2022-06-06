import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    Logger.debug(`Request: `, request);
    const { email, password } = request.user;

    try {
      const user = await this.authService.validateUser(email, password);
      Object.assign(request, user);

      return user !== null; // 🤔
    } catch (e) {
      Logger.error(`Auth Guard Exception`, e);
      throw e;
    }
  }
}
