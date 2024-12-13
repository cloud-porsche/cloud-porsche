import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class MonitoringService {
  async test() {
    return 'OK';
  }
}
