import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConfigs } from '../config/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import * as redisStore from 'cache-manager-ioredis';
import { REDIS_HOST, REDIS_PORT } from '../config/redis.config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    /** Todo: Remove AUTH MS After */
    JwtModule.register({
      secret: jwtConfigs.secret,
      signOptions: { expiresIn: jwtConfigs.expiresIn },
    }),
    CacheModule.register({
      store: redisStore,
      host: REDIS_HOST,
      port: REDIS_PORT,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
