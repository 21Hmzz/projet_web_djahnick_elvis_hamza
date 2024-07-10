// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request as ExpressRequest, Response, NextFunction } from 'express';

// interface Request extends ExpressRequest {
//   user?: any;
// }

// @Injectable()
// export class UserMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (token) {
//       const user = getUser(token);
//       req.user = user;
//     }
//     next();
//   }
// }
