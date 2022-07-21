import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DataBaseConfigModule } from './config/database/database.module';
import { DataBaseConfigService } from './config/database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/../env/.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [DataBaseConfigModule],
      useClass: DataBaseConfigService,
      inject: [DataBaseConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
