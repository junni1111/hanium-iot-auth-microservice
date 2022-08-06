import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    NotificationModule,
  ],
  controllers: [UserController],
  providers: [UserService, NotificationService],
  exports: [UserService],
})
export class UserModule {}
