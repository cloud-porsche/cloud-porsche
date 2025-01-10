
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@cloud-porsche/types';
import { ROLES_KEY } from './roles.decorator';
import * as admin from 'firebase-admin';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { hostname, user } = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

     // if(hostname === 'localhost') {
    //   return true;
    // }

    if (!requiredRoles) {
      return true;
    }
    if (requiredRoles.some((role) => user.role?.includes(role))) {
      return true;
    }
    return false;
  }
}