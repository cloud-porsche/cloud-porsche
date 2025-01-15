
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@cloud-porsche/types';
import { ROLES_KEY } from './roles.decorator';
import * as admin from 'firebase-admin';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { hostname, headers } = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if(hostname === 'localhost') {
      return true;
    }

    if (!requiredRoles) {
      return true;
    }
    const token = headers.authorization;
    const tenantId = headers['tenant-id'];
  
    if (!token) {
      return false;
    }
  
    try {
      const decodedToken = tenantId
        ? await admin
            .auth()
            .tenantManager()
            .authForTenant(tenantId)
            .verifyIdToken(token)
        : await admin.auth().verifyIdToken(token);
      return requiredRoles.includes(decodedToken.role);
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  }
}
