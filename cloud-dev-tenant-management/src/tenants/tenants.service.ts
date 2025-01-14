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
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ITenant, TenantTier } from '@cloud-porsche/types';

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

  async migrateTenant(
    oldTenantId: string,
    newTenantId: string,
    userToken: string,
    newUserToken: string,
  ) {
    if (!oldTenantId || !newTenantId || !userToken || !newUserToken) {
      return HttpErrorByCode[500];
    }
    const tenantAuth = admin.auth().tenantManager().authForTenant(oldTenantId);
    const decodedToken = await tenantAuth.verifyIdToken(userToken);
    const newTenantAuth = admin
      .auth()
      .tenantManager()
      .authForTenant(newTenantId);
    const newDecodedToken = await newTenantAuth.verifyIdToken(newUserToken);
    if (decodedToken.email !== newDecodedToken.email) {
      return HttpErrorByCode[403];
    }

    const oldTenantDoc = admin
      .firestore()
      .collection('Tenants')
      .doc(oldTenantId);
    if (!oldTenantDoc) {
      return {
        error: 'Old tenant doc not found',
      };
    }
    const oldTenant = (await oldTenantDoc.get()).data() as ITenant;
    if (!oldTenant) {
      return {
        error: 'Old tenant information not found',
      };
    }
    if (
      oldTenant.tier !== TenantTier.FREE &&
      oldTenant.adminEmail !== decodedToken.email
    ) {
      return HttpErrorByCode[403];
    }

    const newTenantDoc = admin
      .firestore()
      .collection('Tenants')
      .doc(newTenantId);
    if (!newTenantDoc) {
      return {
        error: 'New tenant document not found',
      };
    }
    const newTenant = (await newTenantDoc.get()).data() as ITenant;
    if (!newTenant) {
      return {
        error: 'New tenant information not found',
      };
    }
    if (newTenant.adminEmail !== newDecodedToken.email) {
      return HttpErrorByCode[403];
    }
    const creds = {
      credential:
        process.env.FIREBASE_OVERWRITE_CREDENTIALS === 'true'
          ? admin.credential.cert(
              process.env.FIREBASE_CLIENT_EMAIL
                ? {
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.split(
                      String.raw`\n`,
                    ).join('\n'),
                  }
                : require('cloud-porsche.json'),
            )
          : admin.credential.applicationDefault(),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
    };
    admin.initializeApp(creds, 'old');
    admin.initializeApp(creds, 'new');
    const firestoreOld = admin.firestore(admin.app('old'));
    firestoreOld.settings({
      databaseId: 'property-management-' + oldTenantId,
      ignoreUndefinedProperties: true,
    });
    const firestoreNew = admin.firestore(admin.app('new'));
    firestoreNew.settings({
      databaseId: 'property-management-' + newTenantId,
      ignoreUndefinedProperties: true,
    });

    const oldTenantIdField =
      oldTenant.tier === TenantTier.FREE ? decodedToken.uid : oldTenantId;

    const collections = await firestoreOld.listCollections();
    for (const collection of collections) {
      const docs = await collection.listDocuments();
      for (const doc of docs) {
        const data = (await doc.get()).data();
        if (data.tenantId === oldTenantIdField) {
          Object.assign(data, { tenantId: newTenantId });
          await firestoreNew.collection(collection.id).doc(doc.id).set(data);
        }
      }
    }

    return HttpErrorByCode[200];
  }
}
