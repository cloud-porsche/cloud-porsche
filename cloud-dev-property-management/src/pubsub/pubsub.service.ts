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
    this.topicName = 'monitoring_queue';
  }

  async publishMessage(messageData: any): Promise<void> {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(messageData));
      await this.pubSubClient.topic(this.topicName).publish(messageBuffer);
      console.log(
        `Message of type ${messageData.messageType} published to Pub/Sub`,
      );
    } catch (error) {
      this.logger.error('Error publishing message to Pub/Sub', error);
    }
  }
}
