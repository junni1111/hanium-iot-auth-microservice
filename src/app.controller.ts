import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  @Get('/')
  healthCheck(): string {
    return `ok`;
  }

  @MessagePattern('ping', Transport.TCP)
  async pingToDeviceMicroservice(@Payload() payload: string): Promise<string> {
    console.log(`Ping from api gateway`, payload);
    return 'auth-pong';
  }
}
