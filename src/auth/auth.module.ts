import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './guards/local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from '../config/jwt/jwt.service';
import { JwtConfigModule } from '../config/jwt/jwt.module';
import { CacheConfigService } from '../config/cache/cache.service';
import { CacheConfigModule } from '../config/cache/cache.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      useClass: JwtConfigService,
      inject: [JwtConfigService],
    }),
    PassportModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return { defaultStrategy: 'jwt' };
      },
    }),
    CacheModule.registerAsync({
      imports: [CacheConfigModule],
      useClass: CacheConfigService,
      inject: [CacheConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
