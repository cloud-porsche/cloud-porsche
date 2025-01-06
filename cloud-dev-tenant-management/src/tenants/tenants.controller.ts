import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { Tenant } from './dto/tenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post('/')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the new tenant',
          example: 'Gustav-AG',
        },
        plan: {
          type: 'string',
          description: 'The plan of the new tenant',
          example: 'enterprise',
        },
        email: {
          type: 'string',
          description: 'The email of the tenant creator',
          example: 'user@example.com',
        },
      },
      required: ['email', 'plan', 'name'],
    },
  })
  async createTenant(@Body() tenant: Tenant) {
    return await this.tenantsService.createTenant(tenant);
  }

  @Delete(':tenantId')
  async deleteTenant(@Param('tenantId') tenantId: string) {
    return await this.tenantsService.deleteTenant(tenantId);
  }

  @Get(':tenantId/users')
  @ApiParam({
    name: 'tenantId',
    description: 'The ID of the tenant to which the user will be added.',
    example: 'tenant123',
  })
  getTenantUser(@Param('tenantId') tenantId: string): Promise<any> {
    return this.tenantsService.getTenantUsers(tenantId);
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

  @Delete(':tenantId/users/:uid')
  async deleteTenantUser(
    @Param('tenantId') tenantId: string,
    @Param('uid') uid: string,
  ) {
    return await this.tenantsService.deleteTenantUser(tenantId, uid);
  }
}
