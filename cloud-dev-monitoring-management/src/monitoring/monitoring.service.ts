import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import { ApiCall } from './entities/api-call.entity';
import { BaseFirestoreRepository, getRepository } from 'fireorm';
import { ParkingAction } from './entities/parking-action-entity';

@Injectable()
export class MonitoringService {
  public apiCallRepository: BaseFirestoreRepository<ApiCall> =
    getRepository(ApiCall);
  public parkingActionRepository: BaseFirestoreRepository<ParkingAction> =
    getRepository(ParkingAction);
  public pubSubClient: PubSub;
  public subscriptionName: string;

  constructor() {
    this.pubSubClient = new PubSub({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
      },
    });
    this.subscriptionName = 'monitoring_subscription';

    this.listenForMessages();
  }

  async listenForMessages() {
    const subscription = this.pubSubClient.subscription(this.subscriptionName);

    subscription.on('message', (message) => {
      const data = JSON.parse(message.data.toString());
      const { messageType, ...d } = data;

      if (messageType == 'parking') {
        const parkingAction = new ParkingAction(d);
        this.parkingActionRepository.create(parkingAction);
        message.ack();
      } else {
        const apiCall = new ApiCall(d);
        this.apiCallRepository.create(apiCall);
        message.ack();
      }
    });

    subscription.on('error', (error) => {
      console.error('Error receiving message:', error);
    });

    console.log(
      `Listening for messages on subscription: ${this.subscriptionName}`,
    );
  }

  async test() {
    return 'OK';
  }
}
