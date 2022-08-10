import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UTILITY } from './util/constants/swagger';

@ApiTags(UTILITY)
@Controller()
export class AppController {
  @Get('/')
  healthCheck(): string {
    console.log('Health Check');
    return `ok`;
  }

  @Get('ping')
  async pingToAuthUserMicroservice() {
    console.log(`Ping from api gateway`);
    return 'auth-pong';
  }
}
