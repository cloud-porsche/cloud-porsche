import { Injectable, Logger } from '@nestjs/common';
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
    const collectionRef = this.db.collection('ParkingProperties'); // Replace with your Firestore collection name

    // Listen for real-time updates
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
          })
          this.logger.debug('Parking property changed - Sending to clients');
          this.io.to(clientId).emit('parking-properties', parkingProperties); // Emit the changes to connected clients
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
    const tenantId = client.handshake.headers['tenant-id'];

    console.log(token);
    console.log(tenantId);
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
    console.log(this.client_tenantIds);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client id: ${client.id} disconnected`);
    this.client_tenantIds.delete(client.id);
    console.log(this.client_tenantIds);
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
