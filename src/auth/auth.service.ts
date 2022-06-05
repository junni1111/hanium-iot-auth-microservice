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
import { USER_AUTH_MICROSERVICE } from '../util/constants/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_AUTH_MICROSERVICE) private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  sendMessage(pattern: any, message: any): Observable<any> {
    return this.client.send(pattern, message).pipe(
      map((data) => {
        console.log(`data`, data);
        return data;
      }),
      catchError((e) => {
        throw new GatewayTimeoutException(e);
      }),
    );
  }
  async validateUser(email: string, password: string) {
    try {
      Logger.debug(`Call Validate User`, email, password);
      const user = await lastValueFrom(
        /** Todo: Find DB
         *        Replace Message Pattern */
        this.client.send({ role: `user`, cmd: `get` }, { email }).pipe(
          timeout(5000),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        ),
      );
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
