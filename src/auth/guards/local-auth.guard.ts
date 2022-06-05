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
    const payload = context.switchToRpc().getData();

    try {
      const user = await this.authService.validateUser(
        payload.email,
        payload.password,
      );
      payload.password = null;
      Object.assign(payload, user);

      return user !== null;
    } catch (e) {
      Logger.error(`Auth Guard Exception`, e);
      throw e;
    }
  }
}
