import { Injectable } from '@nestjs/common';
import { ApiCall } from './entities/api-call.entity';
import { BaseFirestoreRepository, getRepository } from 'fireorm';
import { ParkingAction } from './entities/parking-action-entity';
import { addDays, subDays } from 'date-fns';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class MonitoringService {
  private apiCallRepository = getRepository(ApiCall);
  private parkingActionRepository = getRepository(ParkingAction);
  private pubSubClient: PubSub;
  private subscriptionName = 'monitoring_subscription';

  constructor() {
    this.pubSubClient = new PubSub({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
      },
    });
    this.listenForMessages();
  }

  private async listenForMessages() {
    const subscription = this.pubSubClient.subscription(this.subscriptionName);

    subscription.on('message', (message) => {
      const data = JSON.parse(message.data.toString());
      const { messageType, ...d } = data;

      if (messageType === 'parking') {
        this.parkingActionRepository.create(new ParkingAction(d));
      } else {
        this.apiCallRepository.create(new ApiCall(d));
      }
      message.ack();
    });

    subscription.on('error', (error) => {
      console.error('Error receiving message:', error);
    });

    console.log(
      `Listening for messages on subscription: ${this.subscriptionName}`,
    );
  }

  private getStartDate(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case 'total':
        return subDays(now, 365 * 3);
      case 'yearly':
        return subDays(now, 365);
      case 'monthly':
        return subDays(now, 30);
      case 'weekly':
        return subDays(now, 7);
      default:
        throw new Error(
          'Invalid timeframe. Use total, yearly, monthly, or weekly.',
        );
    }
  }

  async getAlltimeCustomers(): Promise<number> {
    const parkingActions = await this.parkingActionRepository.find();
    return parkingActions.filter((action) => action.action === 'enter').length;
  }

  async getApiCalls(timeframe: string): Promise<number> {
    const startDate = this.getStartDate(timeframe);
    const apiCalls = await this.apiCallRepository.find();
    return apiCalls.filter(
      (apiCall) => new Date(apiCall.timestamp) >= startDate,
    ).length;
  }

  async getCustomerDistribution(
    timeframe: string,
  ): Promise<Record<string, number>> {
    const startDate = this.getStartDate(timeframe);
    const parkingActions = await this.parkingActionRepository.find();
    const enterActions = parkingActions.filter(
      (action) =>
        action.action === 'enter' && new Date(action.timestamp) >= startDate,
    );

    return enterActions.reduce(
      (distribution, action) => {
        distribution[action.propertyName] =
          (distribution[action.propertyName] || 0) + 1;
        return distribution;
      },
      {} as Record<string, number>,
    );
  }

  async getCustomerData(
    timeframe: string,
  ): Promise<{ data: Record<string, number> }> {
    const startDate = this.getStartDate(timeframe);
    const parkingActions = await this.parkingActionRepository.find();
    const enterActions = parkingActions.filter(
      (action) => action.action === 'enter',
    );
    const dateRange = this.generateDateRange(startDate, new Date());

    return { data: this.aggregateByDay(enterActions, dateRange) };
  }

  private generateDateRange(startDate: Date, endDate: Date): string[] {
    const range: string[] = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      range.push(currentDate.toISOString().slice(0, 10)); // Format: YYYY-MM-DD
      currentDate = addDays(currentDate, 1);
    }
    return range;
  }

  private aggregateByDay(
    actions: ParkingAction[],
    daysInRange: string[],
  ): Record<string, number> {
    const results = daysInRange.reduce(
      (acc, day) => ({ ...acc, [day]: 0 }),
      {},
    );

    actions.forEach((action) => {
      const actionDate = action.timestamp.toString().slice(0, 10);
      if (results[actionDate] !== undefined) {
        results[actionDate] += 1;
      }
    });

    return results;
  }

  async getAllData(timeframe: string) {
    const [customers, customerDistribution, totalCustomers, apiCalls] =
      await Promise.all([
        this.getCustomerData(timeframe),
        this.getCustomerDistribution(timeframe),
        this.getAlltimeCustomers(),
        this.getApiCalls(timeframe),
      ]);

    return {
      data: {
        customers: customers.data,
        customer_distribution: customerDistribution,
        total_customers: totalCustomers,
        api_calls: apiCalls,
      },
    };
  }
}
