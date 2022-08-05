import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SendMessageDto } from '../notification/dto/send-message.dto';
import { NotificationService } from '../notification/notification.service';

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
  async sendMessage(
    @Res() res: Response,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    try {
      const { data } = await this.notificationService.sendMessage(
        sendMessageDto,
      );

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'db clear completed',
        data,
      });
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
