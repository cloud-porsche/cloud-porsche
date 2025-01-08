import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { Octokit } from 'octokit';
import { Tenant } from './dto/tenant.dto';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from 'firebase/auth';

@Injectable()
export class TenantsService {
  private logger = new Logger(TenantsService.name);

  private targetBranch: string;
  private octokit: Octokit;
  private workflowId: string;

  constructor(config: ConfigService) {
    this.targetBranch = config.get('TARGET_BRANCH', 'develop');
    this.octokit = new Octokit({ auth: config.get('GITHUB_TOKEN') });
    this.workflowId = config.get('WORKFLOW_ID');
    if (!this.workflowId) {
      this.octokit
        .request('GET /repos/cloud-porsche/cloud-porsche/actions/workflows', {
          owner: 'cloud-porsche',
          repo: 'cloud-porsche',
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        })
        .then((response) => {
          this.workflowId = response.data.workflows.find(
            (workflow: { name: string }) => workflow.name === 'Terraform',
          ).id;
          this.logger.log('Workflow ID: ', this.workflowId);
        });
    }
  }

  async createTenant(tenant: Tenant) {
    return admin
      .auth()
      .tenantManager()
      .createTenant({
        displayName: tenant.name.replace(/ /g, '-').toLowerCase(),
        anonymousSignInEnabled: false,
        emailSignInConfig: {
          enabled: true,
          passwordRequired: true,
        },
      })
      .then(async (newTenant) => {
        const a = getAuth();
        a.tenantId = newTenant.tenantId;
        const userCredential = await createUserWithEmailAndPassword(
          a,
          tenant.email,
          tenant.password,
        );
        await sendEmailVerification(userCredential.user);
        const ghResponse = await this.octokit.request(
          `POST /repos/cloud-porsche/cloud-porsche/actions/workflows/${this.workflowId}/dispatches`,
          {
            ref: this.targetBranch,
            inputs: {
              run_type: 'tenant-create',
              tenant_id: newTenant.tenantId,
              tenant_name: tenant.name,
              tenant_type: tenant.plan,
              location: tenant.location,
              admin_email: tenant.email,
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
      .then(async () => {
        const ghResponse = await this.octokit.request(
          `POST /repos/cloud-porsche/cloud-porsche/actions/workflows/${this.workflowId}/dispatches`,
          {
            ref: this.targetBranch,
            inputs: {
              run_type: 'tenant-delete',
              tenant_id: tenantId,
            },
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          },
        );
        return {
          res: {
            tenantId: tenantId,
          },
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
