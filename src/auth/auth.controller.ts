import {
  Controller,
  Logger,
  Post,
  UseGuards,
  Req,
  Query,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Req() req: any) {
    return this.authService.signIn(req.user);
  }

  @Get('refresh')
  refresh(
    @Query('access') accessToken: string,
    @Query('refresh') refreshToken: string,
  ) {
    return this.authService.regenerateAccessToken(accessToken, refreshToken);
  }

  @Get('jwt')
  async auth(@Query('jwt') jwt: string) {
    return this.authService.validateToken(jwt);
  }
}
