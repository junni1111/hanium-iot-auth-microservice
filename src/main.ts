import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import {
  USER_AUTH_HEALTH_PORT,
  USER_AUTH_HOST,
  USER_AUTH_PORT,
} from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Logger.log(`ENV Level: `, process.env.NODE_ENV);
  Logger.log(`ENV List: `, process.env);

  await app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: USER_AUTH_HOST,
      port: USER_AUTH_PORT,
    },
  });

  /** Todo: Device Auth Microservice */

  await app.startAllMicroservices();
  await app.listen(USER_AUTH_HEALTH_PORT);
  Logger.log(`Start Auth Microservice 
  HOST: ${USER_AUTH_HOST} 
  PORT: ${USER_AUTH_PORT}
  HEALTH_PORT: ${USER_AUTH_HEALTH_PORT}`);
}
bootstrap();
