import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get('user/:id')
  // findUser(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }

  /**
   * Todo: Connect DB */
  // Todo: Change to DTO
  @MessagePattern({ role: `user`, cmd: `get` })
  async findOne(@Payload() dto: any) {
    const { email } = dto;
    const filteredUser = this.userService.findOne(email);
    Logger.debug(`Filtered User: `, filteredUser);

    return filteredUser;
  }
}
