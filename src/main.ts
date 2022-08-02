import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const USER_AUTH_HOST = configService.get<number>('USER_AUTH_HOST');
  const USER_AUTH_PORT = configService.get<number>('AUTH_PORT_9000_TCP_PORT');

  console.log(`ENV Level: `, process.env.NODE_ENV);
  console.log(`ENV List: `, process.env);

  await app.listen(USER_AUTH_PORT);
  Logger.log(`Start Auth Microservice 
  HOST: ${USER_AUTH_HOST} 
  PORT: ${USER_AUTH_PORT}`);
}
bootstrap();
