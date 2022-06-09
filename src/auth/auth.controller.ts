import {
  Controller,
  UseGuards,
  Logger,
  Headers,
  UseFilters,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ExceptionFilter } from './guards/filters/exception.filter';
import { ValidateJwtDto } from './dto/validate-jwt.dto';

@Controller()
// @UseFilters(ExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @MessagePattern({ cmd: 'sign_in' })
  async login(@Payload() data: any) {
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'jwt' })
  async auth(@Payload() { authorization }: any) {
    try {
      console.log(`payload: `, authorization);
      const authResult = await this.authService.validateToken(authorization);
      console.log(authResult);
      return authResult;
    } catch (e) {
      Logger.debug(e.name);
      Logger.debug(e.message);

      switch (e.name) {
        case 'TokenExpiredError':
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
