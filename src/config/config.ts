import * as path from 'path';
import * as dotenv from 'dotenv';

/** Todo: Refactor to service */
export default () => {
  dotenv.config({
    path: path.join(__dirname, `../../env/.env.${process.env.NODE_ENV}`),
  });
};

export const USER_AUTH_HOST = process.env.USER_AUTH_HOST || '0.0.0.0';
export const USER_AUTH_PORT =
  Number(process.env.AUTH_PORT_9999_TCP_PORT) || 9999;
export const USER_AUTH_HEALTH_PORT =
  Number(process.env.AUTH_PORT_9000_TCP_PORT) || 9000;
