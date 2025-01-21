import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
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

  constructor() {
    this.db = getFirestore();
  }

  private initializeFirestoreListener(wsClientId: string, tenantId: string) {
    const collectionRef = this.db
      .collection('ParkingProperties')
      .where('tenantId', '==', tenantId);

    collectionRef.onSnapshot(
      (snapshot) => {
        const parkingProperties = snapshot.docs.map((d) => d.data());
        this.logger.debug('Parking property changed - Sending to clients');
        this.io.to(wsClientId).emit('parking-properties', parkingProperties);
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
    const token = client.handshake.headers['authorization'];
    let tenantId = client.handshake.headers['tenant-id'];

    const clientId =
      client.handshake.headers['origin'].includes('localhost') && !tenantId
        ? 'localhost'
        : client.id;

    this.logger.log(`Client id: ${clientId} connected`);
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
        this.initializeFirestoreListener(clientId, tenantId);
      })
      .catch((error: any) => {
        this.logger.error(error);
        client.disconnect();
      });
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client id: ${client.id} disconnected`);
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
