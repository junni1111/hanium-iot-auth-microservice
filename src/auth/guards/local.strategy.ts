import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: `email`, passwordField: `password` });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log(`Call Local Strategy`, email, password);
    try {
      const user = await this.authService.validateUser(email, password);

      console.log(`Validated user: `, user);
      // if (!user) {
      //   throw new UnauthorizedException(`Unauthorized User`);
      // }
      return user;
    } catch (e) {
      throw e;
    }
  }
}
