import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { Cache } from 'cache-manager';
import { RefreshTokenKey } from '../util/key-generator';
import { ConfigService } from '@nestjs/config';
import { AuthUserDto } from '../user/dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, rawPassword: string): Promise<AuthUserDto> {
    try {
      const user = await this.userService.findOne(email);
      console.log('user : ', user);
      if (!user) {
        console.log('user does not exist');
        throw new NotFoundException('User Does Not Exist');
      }

      Logger.debug(`Find User: `, user);

      if (await compare(rawPassword, user.password)) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }

      throw new UnauthorizedException(`Password Invalid`);
    } catch (e) {
      throw e;
    }
  }

  async signRefreshToken(userId: number) {
    try {
      const token = this.jwtService.sign(
        {},
        {
          // secret: jwtConfigs.refreshSecret,
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),

          // expiresIn: jwtConfigs.refreshExpiresIn,
        },
      );

      const key = RefreshTokenKey(userId);
      await this.cacheManager.set<string>(key, token, { ttl: 1209600 }); // 🤔 2주
      Logger.debug(await this.cacheManager.get<string>(key));

      return token;
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  signAccessToken(authUserDto: AuthUserDto) {
    return this.jwtService.sign({ ...authUserDto });
  }

  async compareRefreshToken(userId: any, refreshToken: string) {
    const key = RefreshTokenKey(userId); // 🤔 Need Refactor!!
    const cachedRefreshToken = await this.cacheManager.get<string>(key);

    return refreshToken === cachedRefreshToken;
  }

  async regenerateAccessToken(userId: number, refreshToken: string) {
    try {
      if (await this.compareRefreshToken(userId, refreshToken)) {
        return {
          userId: userId,
          // Todo: Remove Mock Token
          // accessToken: this.signAccessToken(userId),
          accessToken: 'mock',
          refreshToken: await this.signRefreshToken(userId),
        };
      }

      const key = RefreshTokenKey(userId);
      await this.cacheManager.del(key);
      throw new ForbiddenException('Jwt Not Validated');
    } catch (e) {
      throw new ForbiddenException('Jwt Not Validated');
    }
  }

  async signIn(authUserDto: AuthUserDto) {
    const accessToken = this.signAccessToken(authUserDto);
    const refreshToken = await this.signRefreshToken(authUserDto.id);

    return {
      userId: authUserDto?.id,
      accessToken,
      refreshToken,
    };
  }

  validateToken(token: string) {
    try {
      // console.log('jwt : ', token);
      return this.jwtService.verify(token);
    } catch (e) {
      console.log(e);
      throw new ForbiddenException('Jwt Not Validated');
    }
  }

  async signOut(userId: number) {
    try {
      const key = RefreshTokenKey(userId);
      return await this.cacheManager.del(key);
    } catch (e) {
      throw e;
    }
  }
}
