import { Controller, Delete, Param, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post(':name')
  createTenant(@Param('name') name: string): Promise<string> {
    return this.tenantsService.createTenant(name);
  }

  @Delete(':name')
  deleteTenant(@Param('name') name: string): Promise<string> {
    return this.tenantsService.deleteTenant(name);
  }
}
