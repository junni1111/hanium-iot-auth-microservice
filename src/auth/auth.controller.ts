import { Controller, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @MessagePattern({ cmd: 'sign_in' })
  async login(@Payload() data: any) {
    console.log(`Login Controller: `, data);
    return this.authService.login(data);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern({ cmd: 'jwt' })
  async auth(@Payload() payload: any) {
    Logger.debug(`Pass Auth`, payload);

    return payload;
  }
}
