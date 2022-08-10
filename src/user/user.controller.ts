import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SendMessageDto } from '../notification/dto/send-message.dto';
import { NotificationService } from '../notification/notification.service';
import { USER } from '../util/constants/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(USER)
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    console.log('dto : ', createUserDto);
    return this.userService.signUp(createUserDto);
  }

  @Post('message')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    try {
      const sendResult = await this.notificationService.sendMessage(
        sendMessageDto,
      );

      return sendResult;
    } catch (e) {
      throw e;
    }
  }

  @Delete('db')
  clearUserDB() {
    console.log('user db clear!');
    return this.userService.clearUserDB();
  }
}
