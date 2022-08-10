import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AUTH, USER, UTILITY } from './constants/swagger';

const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

export const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('Auth User Microservice API')
    .setDescription('Auth User Microservice API 문서입니다')
    .setVersion('1.0.0')
    .addTag(USER)
    .addTag(AUTH)
    .addTag(UTILITY)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('ms-spec', app, document, swaggerCustomOptions);
};
