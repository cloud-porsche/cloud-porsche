import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class TenantsService {
  async createTenant(name: string) {
    const newTenant = admin
      .auth()
      .tenantManager()
      .createTenant({
        displayName: name,
        emailSignInConfig: {
          enabled: true,
          passwordRequired: true,
        },
      })
      .then((tenant) => {
        return tenant.toJSON();
      })
      .catch((error) => {
        return error;
      });
    return newTenant;
  }

  async deleteTenant(name: string) {
    return admin
      .auth()
      .tenantManager()
      .deleteTenant(name)
      .then(() => {
        return `Tenant ${name} deleted`;
      })
      .catch((error) => {
        return error;
      });
  }

  async addTenantUser(tenantId: string, email: string) {
    const tenantAuth = admin.auth().tenantManager().authForTenant(tenantId);
    return tenantAuth
      .createUser({
        email: email,
      })
      .then((user) => {
        return user.toJSON();
      })
      .catch((error) => {
        return error;
      });
  }
}
