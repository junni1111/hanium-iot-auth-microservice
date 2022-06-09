import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
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

  async signRefreshToken({ user }: any) {
    try {
      const token = this.jwtService.sign(user, {
        secret: jwtConfigs.refreshSecret,
        expiresIn: jwtConfigs.refreshExpiresIn,
      });

      const key = RefreshTokenKey(user.email);
      await this.cacheManager.set<string>(key, token, { ttl: 1209600 }); // 🤔 2주

      return token;
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  signAccessToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  async getNewAccessToken(token: string) {
    const decoded = this.jwtService.decode(token);

    const key = RefreshTokenKey(decoded['user']['email']); // 🤔 Need Refactor!!
    console.log(`Get Decoded key: `, key);
    const refreshToken = await this.cacheManager.get<string>(key);

    console.log(`Decoded Result: `, refreshToken);
  }

  async login(user: any) {
    const accessToken = this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user);

    return {
      userId: user?.id,
      accessToken,
      refreshToken,
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token);
  }
}
