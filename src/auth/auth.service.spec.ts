import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { JwtConfigModule } from '../config/jwt/jwt.module';
import { JwtConfigService } from '../config/jwt/jwt.service';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/common';
import { CacheConfigModule } from '../config/cache/cache.module';
import { CacheConfigService } from '../config/cache/cache.service';
import { User } from '../user/entities/user.entity';
// import { jwtConfigs } from '../config/jwt/jwt.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `${__dirname}/../env/.env.${process.env.NODE_ENV}`,
          isGlobal: true,
        }),
        UserModule,
        JwtModule.registerAsync({
          imports: [JwtConfigModule],
          useClass: JwtConfigService,
          inject: [JwtConfigService],
        }),
        PassportModule.registerAsync({
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
      providers: [AuthService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  /** Todo: Fix */
  it('로그인에 성공한다', () => {
    const user = { email: 'mock@mock.com' };
    const loginResult = jwtService.sign(user);
    console.log(`result: `, loginResult);
    expect(service).toBeDefined();
  });
});
