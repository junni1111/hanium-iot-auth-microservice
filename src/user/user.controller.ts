import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Get('db/clear')
  dbClear() {
    console.log('db clear!');
    return this.userService.dbClear();
  }
}
