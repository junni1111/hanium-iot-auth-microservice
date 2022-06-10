import {
  Controller,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @MessagePattern({ cmd: 'sign_in' })
  async login(@Payload() { user }: any) {
    return this.authService.login(user);
  }

  @MessagePattern({ cmd: 'refresh' })
  refresh(@Payload() tokens: any) {
    try {
      return this.authService.regenerateAccessToken(
        tokens.accessToken,
        tokens.refreshToken,
      );
    } catch (e) {
      Logger.error(e);
    }
  }

  @MessagePattern({ cmd: 'jwt' })
  async auth(@Payload() jwt: string) {
    try {
      return this.authService.validateToken(jwt);
    } catch (e) {
      Logger.debug(e.name);
      Logger.debug(e.message);

      switch (e.name) {
        case 'TokenExpiredError':
          /** Todo: Frontend에서 401 에러받으면 Refresh Token 재발급 요청 */
          return new UnauthorizedException('Token 유효 시간 끝남');
        case 'JsonWebTokenError':
          return new NotFoundException('Token 유효하지 않음');
        case 'NotBeforeError':
          return new NotFoundException(e.message);
        default:
          Logger.error(`JWT authentication unhandled exception`, e.message);
          return new InternalServerErrorException(e.message);
      }
    }
  }
}
