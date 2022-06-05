import {
  Controller,
  Post,
  UseGuards,
  Request,
  Logger,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
// import { AuthGuard } from './guards/auth.guard';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @MessagePattern({ cmd: 'sign_in' })
  async login(@Payload() data: any) {
    return this.authService.login(data);
  }

  // @UseGuards(AuthGuard)
  @Post(`auth/jwt`)
  useJwt(@Res() res: Response) {
    Logger.log(`You Pass Auth`);

    return res.send(`You Pass Auth`);
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async auth(authDto: any) {
    const { jwt } = authDto;
    Logger.debug(`Call Auth`, jwt);

    return this.authService.validateToken(jwt);
  }

  // @MessagePattern({ role: `user`, cmd: `get` })
  // async getUser(data: any) {
  //   Logger.debug(`Call getUser`, data);
  //
  //   const user = { userName: `jee`, password: `123123` };
  //
  //   return user;
  // }
}
