import {
  ForbiddenException,
  GatewayTimeoutException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
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
import { ValidateJwtDto } from './dto/validate-jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findOne(email);
      if (!user) {
        /** Todo: Send NotFoundException */
        return new NotFoundException('존재하지 않는 사용자입니다');
      }

      Logger.debug(`Find User: `, user);

      if (await compare(password, user.password)) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }

      /** Todo: Send UnauthorizedException */

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

  validateToken(authorization: string) {
    const jwt = authorization?.split(' ')[1];

    return this.jwtService.verify(jwt);
  }
}
