import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const USER_AUTH_HOST = configService.get<string>('USER_AUTH_HOST', '0.0.0.0');
  const USER_AUTH_PORT = configService.get<number>(
    'AUTH_PORT_9999_TCP_PORT',
    9999,
  );
  const USER_AUTH_HEALTH_PORT = configService.get<number>(
    'AUTH_PORT_9000_TCP_PORT',
    9000,
  );

  console.log(`ENV Level: `, process.env.NODE_ENV);
  console.log(`ENV List: `, process.env);

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
