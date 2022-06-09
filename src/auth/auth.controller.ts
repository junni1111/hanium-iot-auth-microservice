import {
  Controller,
  UseGuards,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @MessagePattern({ cmd: 'sign_in' })
  async login(@Payload() data: any) {
    console.log(`Login Data: `, data);
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'jwt' })
  async auth(@Payload() { authorization }: any) {
    const jwt = authorization?.split(' ')[1];

    try {
      const result = this.authService.validateToken(jwt);
      // console.log(`Decode Token: `, result);
      return result;
    } catch (e) {
      Logger.debug(e.name);
      Logger.debug(e.message);

      switch (e.name) {
        case 'TokenExpiredError':
          /** Todo: Refresh Token으로 재발급*/
          await this.authService.getNewAccessToken(jwt);
          return new UnauthorizedException('Token 유효 시간 끝남');
        case 'JsonWebTokenError':
          return new UnauthorizedException('Token 유효하지 않음');
        case 'NotBeforeError':
          return new UnauthorizedException(e.message);
        default:
      }
    }
  }
}
