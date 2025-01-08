import { Injectable, Logger } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class PubSubService {
  private readonly logger = new Logger(PubSubService.name);
  private pubSubClient: PubSub;
  private topicName: string;

  constructor() {
    this.pubSubClient = new PubSub({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
      },
    });
    this.topicName = process.env.MONITORING_QUEUE;
  }

  async publishMessage(messageData: object): Promise<void> {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(messageData));
      const messageId = await this.pubSubClient
        .topic(this.topicName)
        .publish(messageBuffer);

      this.logger.log(`Message ${messageId} published to Pub/Sub`);
    } catch (error) {
      this.logger.error('Error publishing message to Pub/Sub', error);
    }
  }
}
