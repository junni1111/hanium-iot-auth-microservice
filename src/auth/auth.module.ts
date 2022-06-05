import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConfigs } from './constants';
import { USER_AUTH_MICROSERVICE } from '../util/constants/microservices';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ClientsModule.register([
      {
        name: USER_AUTH_MICROSERVICE,
        transport: Transport.TCP,
        options: {
          host: `localhost`,
          port: 9999,
        },
      },
    ]),
    JwtModule.register({
      secret: jwtConfigs.secret,
      signOptions: { expiresIn: `5m` },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
