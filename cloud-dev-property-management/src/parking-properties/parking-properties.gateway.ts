import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { ParkingProperty } from './entities/parking-property.entity';
import * as admin from 'firebase-admin';

@WebSocketGateway({
  cors: {
    origin: [
      'https://cloud-porsche.github.io',
      'https://app.cloud-porsche.com',
      'https://cloud-dev.ostabo.com',
      'http://localhost:3000',
    ],
  },
})
export class ParkingPropertiesGateway {
  private readonly logger = new Logger(ParkingPropertiesGateway.name);

  @WebSocketServer() io: Server;

  private db: Firestore;
  private client_tenantIds: Map<string, string> = new Map();

  constructor() {
    this.db = getFirestore();
    this.initializeFirestoreListener();
  }

  private initializeFirestoreListener() {
    const collectionRef = this.db.collection('ParkingProperties');

    collectionRef.onSnapshot(
      (snapshot) => {
        this.client_tenantIds.forEach((tenantId, clientId) => {
          const parkingProperties: ParkingProperty[] = [];
          snapshot.forEach((doc) => {
            if (doc.data().tenantId === tenantId) {
              parkingProperties.push({
                id: doc.id,
                ...doc.data(),
              } as ParkingProperty);
            }
          });
          this.logger.debug('Parking property changed - Sending to clients');
          this.io.to(clientId).emit('parking-properties', parkingProperties);
        });
      },
      (error) => {
        this.logger.error('Error listening to Firestore changes:', error);
      },
    );
  }

  afterInit() {
    this.logger.log('WS Initialized');
  }

  handleConnection(client: any) {
    // console.log(client);
    const token = client.handshake.headers['authorization'];
    let tenantId = client.handshake.headers['tenant-id'];

    if (client.handshake.headers['origin'].includes('localhost')) {
      if (!client.handshake.headers['tenant-id']) {
        this.client_tenantIds.set(client.id, 'localhost');
      } else {
        this.client_tenantIds.set(client.id, tenantId);
      }
      return;
    }

    this.logger.log(`Client id: ${client.id} connected`);
    if (!token) {
      this.logger.error('No token provided');
      client.disconnect();
      return;
    }

    const verifyToken = tenantId
      ? admin
          .auth()
          .tenantManager()
          .authForTenant(tenantId)
          .verifyIdToken(token)
      : admin.auth().verifyIdToken(token);
    verifyToken
      .then(() => {
        this.client_tenantIds.set(client.id, tenantId);
      })
      .catch((error: any) => {
        this.logger.error(error);
        client.disconnect();
      });
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client id: ${client.id} disconnected`);
    this.client_tenantIds.delete(client.id);
  }

  @SubscribeMessage('ping')
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'pong',
      data: 'Wrong data that will make the test fail',
    };
  }
}
