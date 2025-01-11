import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  use(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization;
    const tenantId = req.headers['tenant-id'] as string;

    if (req.hostname === 'localhost') {
      if (!tenantId) {
        req.headers['tenant-id'] = 'localhost';
      }
      req['user'] = {
        role: 'admin',
      }
      next();
      return;
    }

    if (!token) {
      this.logger.error('No token provided');
      this.accessDenied(req.url, res);
      return;
    }

    const verifyToken = tenantId
      ? admin
          .auth()
          .tenantManager()
          .authForTenant(tenantId)
          .verifyIdToken(token)
      : admin.auth().verifyIdToken(token);

    verifyToken
      .then((decodedToken: any) => {
        req['user'] = {
          email: decodedToken.email,
          uid: decodedToken.uid,
          role: decodedToken.role,
        };
        if (!tenantId) {
          req.headers['tenant-id'] = decodedToken.uid;
        }
        next();
      })
      .catch((error: any) => {
        this.logger.error(error);
        this.accessDenied(req.url, res);
      });
  }

  private accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied',
    });
  }
}
