import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Logger } from '@nestjs/common';
import { jwtConfigs } from '../../config/jwt.config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfigs.secret,
    });
  }

  async validate(payload) {
    Logger.debug(`Jwt Strategy Call`, payload);
    return { id: payload.sub, user: payload.user };
  }
}
