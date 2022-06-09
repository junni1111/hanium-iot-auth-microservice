import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // const request = context.switchToHttp();

    // console.log(`Switch Context: `, request);
    return super.canActivate(context);
  }

  //
  // handleRequest(err, user, info) {
  //
  // }
}
