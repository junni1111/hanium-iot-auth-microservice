import { Module } from '@nestjs/common';
import { CacheConfigService } from './cache.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [CacheConfigService],
})
export class CacheConfigModule {}
