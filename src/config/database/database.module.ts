import { Module } from '@nestjs/common';
import { DataBaseConfigService } from './database.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [DataBaseConfigService],
})
export class DataBaseConfigModule {}
