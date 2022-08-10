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
import { ApiTags } from '@nestjs/swagger';
import { AUTH } from '../util/constants/swagger';

@ApiTags(AUTH)
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Req() req: any) {
    console.log(`Recv User: `, req.user);
    return this.authService.signIn(req.user);
  }

  @Get('refresh')
  refresh(
    @Query('userId') userId: number,
    @Query('refresh') refreshToken: string,
  ) {
    return this.authService.regenerateAccessToken(userId, refreshToken);
  }

  @Get('jwt')
  auth(@Query('jwt') jwt: string) {
    console.log(`jwt: `, jwt);
    return this.authService.validateToken(jwt);
  }

  @Get('signout')
  signOut(@Query('userId') userId: number) {
    return this.authService.signOut(userId);
  }
}
