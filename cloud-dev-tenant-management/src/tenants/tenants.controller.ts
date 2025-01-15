import { Body, Controller, Delete, Headers, Param, Post } from '@nestjs/common';
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
        location: {
          type: 'string',
          description: 'The location of the created cluster',
          example: 'europe-west4',
        },
        password: {
          type: 'string',
          description: 'The password for the tenant admin',
        },
      },
      required: ['email', 'plan', 'name', 'location', 'password'],
    },
  })
  async createTenant(@Body() tenant: Tenant) {
    return await this.tenantsService.createTenant(tenant);
  }

  @Delete(':tenantId')
  async deleteTenant(@Param('tenantId') tenantId: string) {
    return await this.tenantsService.deleteTenant(tenantId);
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

  @Post(':tenantId/migrate/:newTenantId')
  @ApiParam({
    name: 'tenantId',
    description: 'The ID of the tenant to migrate.',
    example: 'tenant-123gh',
  })
  @ApiParam({
    name: 'newTenantId',
    description: 'The new tenant id.',
    example: 'tenant-428ux',
  })
  async migrateTenant(
    @Param('tenantId') tenantId: string,
    @Param('newTenantId') newTenantId: string,
    @Headers('authorization-old') token: string,
    @Headers('authorization-new') newUserToken: string,
  ) {
    return await this.tenantsService.migrateTenant(
      tenantId,
      newTenantId,
      token,
      newUserToken,
    );
  }
}
