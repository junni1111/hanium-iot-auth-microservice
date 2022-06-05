import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { USER_AUTH_HOST, USER_AUTH_PORT } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userAuthMicroservice = await app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: USER_AUTH_HOST,
      port: USER_AUTH_PORT,
    },
  });

  /** Todo: Device Auth Microservice */

  await app.startAllMicroservices();
  await app.listen(9990);
  Logger.log(`Start Auth Microservice`);
}
bootstrap();
