import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { Octokit } from 'octokit';
import { Tenant } from './dto/tenant.dto';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from 'firebase/auth';
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
        await this.createUserForTenant(
          newTenant.tenantId,
          tenant.email,
          tenant.password,
          'admin',
        );
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

  async addTenantUser(tenantId: string, email: string, role: string) {
    const otp = Math.random().toString(36).slice(-8);
    await this.createUserForTenant(tenantId, email, otp, role)
      .then((user) => {
        return user.toJSON();
      })
      .catch((error) => {
        return error;
      });
  }

  async createUserForTenant(
    tenantId: string,
    email: string,
    password: string,
    role: string,
  ) {
    try {
      const a = getAuth();
      a.tenantId = tenantId;
      const userCredentials = await createUserWithEmailAndPassword(
        a,
        email,
        password,
      );
      const auth = admin.auth().tenantManager().authForTenant(tenantId);
      await auth.setCustomUserClaims(userCredentials.user.uid, { role: role });
      await sendEmailVerification(userCredentials.user);
      return userCredentials.user;
    } catch (error) {
      return error;
    }
  }

  async getTenantUsers(tenantId: string, uid: string) {
    const tenantAuth = admin.auth().tenantManager().authForTenant(tenantId);
    return tenantAuth
      .listUsers()
      .then((result) => {
        return result.users.filter((user) => {
          if (user.uid != uid) return user.toJSON();
        });
      })
      .catch((error) => {
        return error;
      });
  }

  async deleteTenantUser(tenantId: string, uid: string) {
    const tenantAuth = admin.auth().tenantManager().authForTenant(tenantId);
    return tenantAuth
      .deleteUser(uid)
      .then(() => {
        return {
          uid: uid,
        };
      })
      .catch((error) => {
        return error;
      });
  }

  async setUserRole(tenantId: string, uid: string, role: string) {
    const tenantAuth = admin.auth().tenantManager().authForTenant(tenantId);
    return tenantAuth.setCustomUserClaims(uid, { role: role });
  }

  async migrateTenant(
    oldTenantId: string,
    newTenantId: string,
    userToken: string,
    newUserToken: string,
  ) {
    if (!oldTenantId || !newTenantId || !userToken || !newUserToken) {
      throw new InternalServerErrorException('Missing parameters');
    }
    if (newTenantId === 'free-tier') {
      throw new BadRequestException('Migration to free tier not supported');
    }

    const tenantAuth = admin.auth().tenantManager().authForTenant(oldTenantId);
    const decodedToken = await tenantAuth.verifyIdToken(userToken);
    const newTenantAuth = admin
      .auth()
      .tenantManager()
      .authForTenant(newTenantId);
    const newDecodedToken = await newTenantAuth.verifyIdToken(newUserToken);
    if (decodedToken.email !== newDecodedToken.email) {
      throw new ForbiddenException('Unauthorized');
    }

    const oldTenantDoc = admin
      .firestore()
      .collection('Tenants')
      .doc(oldTenantId);
    if (!oldTenantDoc) {
      throw new BadRequestException('Old tenant doc not found');
    }
    const oldTenant = (await oldTenantDoc.get()).data() as ITenant;
    if (!oldTenant) {
      throw new BadRequestException('Old tenant information not found');
    }
    if (
      oldTenant.tier !== TenantTier.FREE &&
      oldTenant.adminEmail !== decodedToken.email
    ) {
      throw new ForbiddenException('Not an admin');
    }

    const newTenantDoc = admin
      .firestore()
      .collection('Tenants')
      .doc(newTenantId);
    if (!newTenantDoc) {
      throw new BadRequestException('New tenant document not found');
    }
    const newTenant = (await newTenantDoc.get()).data() as ITenant;
    if (!newTenant) {
      throw new BadRequestException('New tenant information not found');
    }
    if (newTenant.adminEmail !== newDecodedToken.email) {
      throw new ForbiddenException('Not an admin');
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
    const tenantAppFrom = admin.initializeApp(creds, 'old');
    const tenantAppTo = admin.initializeApp(creds, 'new');

    try {
      const firestoreOld = admin.firestore(tenantAppFrom);
      const oldDbName =
        oldTenant.tier === TenantTier.FREE
          ? 'free-tier'
          : oldTenant.tier === TenantTier.PRO
            ? 'pro-tier'
            : oldTenantId;
      firestoreOld.settings({
        databaseId: 'property-management-' + oldDbName,
        ignoreUndefinedProperties: true,
      });
      const firestoreNew = admin.firestore(tenantAppTo);
      const newDbName =
        oldTenant.tier === TenantTier.PRO ? 'pro-tier' : newTenantId;
      firestoreNew.settings({
        databaseId: 'property-management-' + newDbName,
        ignoreUndefinedProperties: true,
      });

      if (
        newTenant.tier === TenantTier.PRO &&
        oldTenant.tier === TenantTier.ENTERPRISE
      ) {
        const properties = await firestoreOld
          .collection('ParkingProperties')
          .listDocuments();
        if (properties.length > 5)
          throw new BadRequestException(
            'Migration to PRO tier only supports up to 5 properties',
          );
      }

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

      await tenantAppFrom.delete();
      await tenantAppTo.delete();

      return {
        res: {
          from: oldTenantId,
          to: newTenantId,
        },
      };
    } catch (error) {
      await tenantAppFrom.delete();
      await tenantAppTo.delete();
      throw error;
    }
  }
}
