import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { Octokit } from 'octokit';
import { Tenant } from './dto/tenant.dto';

@Injectable()
export class TenantsService {
  private logger = new Logger(TenantsService.name);

  private targetBranch: string;
  private octokit: Octokit;

  constructor(config: ConfigService) {
    this.targetBranch = config.get('TARGET_BRANCH', 'develop');
    this.octokit = new Octokit({ auth: config.get('GITHUB_TOKEN') });
  }

  async createTenant(tenant: Tenant) {
    return admin
      .auth()
      .tenantManager()
      .createTenant({
        displayName: tenant.name,
        anonymousSignInEnabled: false,
        emailSignInConfig: {
          enabled: true,
          passwordRequired: true,
        },
      })
      .then(async (newTenant) => {
        const ghResponse = await this.octokit.request(
          'POST /repos/cloud-porsche/cloud-porsche/actions/workflows/134220414/dispatches',
          {
            ref: this.targetBranch,
            inputs: {
              tenant_id: newTenant.tenantId,
              tenant_type: tenant.plan,
            },
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          },
        );
        return {
          res: newTenant.toJSON(),
          ghResponse: await this.octokit.request(
            'GET ' + ghResponse.url.replace('/dispatches', ''),
          ),
        };
      })
      .catch((error) => {
        this.logger.error(error);
        return error;
      });
  }

  async deleteTenant(tenantId: string) {
    return admin
      .auth()
      .tenantManager()
      .deleteTenant(tenantId)
      .then(() => {
        return tenantId;
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
