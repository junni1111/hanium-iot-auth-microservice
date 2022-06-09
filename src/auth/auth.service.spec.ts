import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConfigs } from '../config/jwt.config';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        JwtModule.register({
          secret: jwtConfigs.secret,
          signOptions: { expiresIn: jwtConfigs.expiresIn },
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
