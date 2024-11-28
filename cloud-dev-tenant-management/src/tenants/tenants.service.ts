import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantsService {
  createTenant(name: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(`Tenant ${name} created`);
    });
  }

  deleteTenant(name: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(`Tenant ${name} deleted`);
    });
  }
}
