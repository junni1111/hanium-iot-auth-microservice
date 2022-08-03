import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  healthCheck(): string {
    console.log('Health Check');
    return `ok`;
  }
}
