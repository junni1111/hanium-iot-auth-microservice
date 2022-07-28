import { Module } from '@nestjs/common';
import { JwtConfigService } from './jwt.service';

@Module({
  providers: [JwtConfigService],
})
export class JwtConfigModule {}
