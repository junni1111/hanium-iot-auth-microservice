import { Module } from '@nestjs/common';
import { JwtConfigService } from './jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [JwtConfigService],
})
export class JwtConfigModule {}
