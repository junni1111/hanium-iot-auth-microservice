import * as path from 'path';
import * as dotenv from 'dotenv';

/** Todo: Refactor to service */
export default () => {
  dotenv.config({
    path: path.join(
      __dirname,
      process.env.NODE_ENV === 'production'
        ? '../../env/.env.production'
        : process.env.NODE_ENV === 'test'
        ? '../../env/.env.test'
        : process.env.NODE_ENV === 'development'
        ? '../../env/.env.development'
        : '../../env/.env',
    ),
  });
};

export const USER_AUTH_HOST = process.env.USER_AUTH_HOST || '0.0.0.0';
export const USER_AUTH_PORT = Number(process.env.USER_AUTH_PORT) || 9999;
