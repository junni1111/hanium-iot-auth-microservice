// import {
//   CanActivate,
//   ExecutionContext,
//   Inject,
//   Injectable,
//   Logger,
// } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { lastValueFrom, map, timeout } from 'rxjs';
// import { USER_AUTH_MICROSERVICE } from '../../util/constants/microservices';
//
// @Injectable()
// export class AuthGuard implements CanActivate {
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     console.log(`In Auth Guard: `, request.headers);
//     try {
//       /** Todo: Replace Message Pattern */
//       const res = await lastValueFrom(
//         this.client
//           .send(
//             { role: 'auth', cmd: 'check' },
//             { jwt: request.headers['authorization']?.split(' ')[1] },
//           )
//           .pipe(
//             timeout(5000),
//             map((data: boolean) => data),
//           ),
//       );
//
//       return res;
//     } catch (e) {
//       Logger.error(`Auth Guard Exception`, e);
//       return false;
//     }
//   }
// }
