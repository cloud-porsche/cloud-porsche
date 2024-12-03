import { Controller, Delete, Param, Post, Body } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post(':name')
  createTenant(@Param('name') displayName: string): Promise<string> {
    return this.tenantsService.createTenant(displayName);
  }

  @Delete(':name')
  deleteTenant(@Param('name') name: string): Promise<string> {
    return this.tenantsService.deleteTenant(name);
  }

  @Post(':tenantId/users')
  @ApiParam({
    name: 'tenantId',
    description: 'The ID of the tenant to which the user will be added.',
    example: 'tenant123',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'The email of the user to be added to the tenant.',
          example: 'user@example.com',
        },
      },
      required: ['email'],
    },
  })
  addTenantUser(
    @Param('tenantId') tenantId: string,
    @Body('email') email: string,
  ): Promise<any> {
    return this.tenantsService.addTenantUser(tenantId, email);
  }
}
