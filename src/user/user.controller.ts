import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    console.log('dto : ', createUserDto);
    return this.userService.signUp(createUserDto);
  }

  @Delete('db')
  clearUserDB() {
    console.log('user db clear!');
    return this.userService.clearUserDB();
  }
}
