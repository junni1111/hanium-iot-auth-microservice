import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { jwtConfigs } from '../config/jwt.config';
import { Cache } from 'cache-manager';
import { RefreshTokenKey } from '../util/key-generator';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, rawPassword: string) {
    try {
      const user = await this.userService.findOne(email);
      if (!user) {
        /** Todo: Send NotFoundException */
        return null;
      }

      Logger.debug(`Find User: `, user);

      if (await compare(rawPassword, user.password)) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      /** Todo: Send UnauthorizedException */
      return null;
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  async signRefreshToken(userId: number) {
    const refreshToken = this.jwtService.sign(
      { userId },
      {
        secret: jwtConfigs.refreshSecret,
        expiresIn: jwtConfigs.refreshExpiresIn,
      },
    );

    const key = RefreshTokenKey(userId);
    this.cacheManager.set<string>(key, refreshToken, { ttl: 1209600 }); // 🤔 2주
  }

  async login(user) {
    const payload = { user, sub: user?.id };
    /**
     * Todo: Create Refresh Token and Cache to redis */

    return {
      userId: user?.id,
      accessToken: this.jwtService.sign(payload),
    };
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
