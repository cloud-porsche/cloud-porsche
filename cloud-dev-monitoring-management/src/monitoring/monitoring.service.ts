import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import { ApiCall } from './entities/api-call.entity';
import { BaseFirestoreRepository, getRepository } from 'fireorm';

@Injectable()
export class MonitoringService {
  public apiCallRepository: BaseFirestoreRepository<ApiCall> =
    getRepository(ApiCall);
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
      const apiCall = new ApiCall(data);

      this.apiCallRepository.create(apiCall);
      message.ack();
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
