import {
  GatewayTimeoutException,
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import {
  catchError,
  lastValueFrom,
  map,
  Observable,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import {
  compare,
  compareSync,
  genSalt,
  genSaltSync,
  hash,
  hashSync,
} from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findOne(email);
      const salt = await genSalt();
      /** Todo: Replace to Hashed Password from DB */
      const mockUserPassword = await hash(user?.password, salt);

      if (await compare(password, mockUserPassword)) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }

      return null;
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  async login(user) {
    const payload = { user, sub: user?.id };

    return {
      userId: user?.id,
      accessToken: this.jwtService.sign(payload),
    };
  }

  validateToken(jwt: string) {
    Logger.debug(`Validate Token`, jwt);
    return this.jwtService.verify(jwt);
  }
}
