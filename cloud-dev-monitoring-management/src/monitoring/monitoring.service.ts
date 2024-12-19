import { Injectable } from '@nestjs/common';
import { ApiCall } from './entities/api-call.entity';
import { BaseFirestoreRepository, getRepository } from 'fireorm';
import { ParkingAction } from './entities/parking-action-entity';
import { addDays, subDays, startOfDay } from 'date-fns';
import { PubSub } from '@google-cloud/pubsub';

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
  async getAlltimeCustomers() {
    const parkingActions = await this.parkingActionRepository.find();
    const enterActions = parkingActions.filter(
      (action) => action.action === 'enter',
    );

    return enterActions.length;
  }

  async getApiCalls(timeframe: string) {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'total':
        startDate = subDays(now, 365 * 3);
        break;
      case 'yearly':
        startDate = subDays(now, 365);
        break;
      case 'monthly':
        startDate = subDays(now, 31);
        break;
      case 'weekly':
        startDate = subDays(now, 7);
        break;
      default:
        throw new Error(
          'Invalid timeframe. Use total, yearly, monthly, or weekly.',
        );
    }

    const apiCalls = await this.apiCallRepository.find();

    const total = apiCalls.filter(
      (apiCall) => new Date(apiCall.timestamp) >= startDate,
    ).length;
    return total;
  }

  /**
   * Gets the distribution of customers per propert
y for a given timeframe
   * @param timeframe timeframe to get customer data for
   */
  async getCustomerDistribution(timeframe: string) {
    const now = new Date();

    let startDate: Date;
    switch (timeframe) {
      case 'total':
        startDate = subDays(now, 365 * 3);
        break;
      case 'yearly':
        startDate = subDays(now, 365);
        break;
      case 'monthly':
        startDate = subDays(now, 30);
        break;
      case 'weekly':
        startDate = subDays(now, 7);
        break;
      default:
        throw new Error(
          'Invalid timeframe. Use total, yearly, monthly, or weekly.',
        );
    }

    const parkingActions = await this.parkingActionRepository.find();
    const enterActions = parkingActions.filter(
      (action) =>
        action.action === 'enter' && new Date(action.timestamp) >= startDate,
    );

    const propertyDistribution = {};

    enterActions.forEach((action) => {
      if (!propertyDistribution[action.propertyName]) {
        propertyDistribution[action.propertyName] = 0;
      }
      propertyDistribution[action.propertyName] += 1;
    });

    return propertyDistribution;
  }

  async getCustomerData(timeframe: string) {
    const now = new Date();

    let startDate: Date;
    switch (timeframe) {
      case 'total':
        startDate = subDays(now, 365 * 3);
        break;
      case 'yearly':
        startDate = subDays(now, 365);
        break;
      case 'monthly':
        startDate = subDays(now, 31);
        break;
      case 'weekly':
        startDate = subDays(now, 7);
        break;
      default:
        throw new Error(
          'Invalid timeframe. Use total, yearly, monthly, or weekly.',
        );
    }

    const parkingActions = await this.parkingActionRepository.find();
    const enterActions = parkingActions.filter(
      (action) => action.action === 'enter',
    );
    const dateRange = this.generateDateRange(startDate, now);

    return this.aggregateByDay(enterActions, dateRange);
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

  private aggregateByDay(actions: ParkingAction[], daysInRange: string[]) {
    const results = {};

    // Initialize all days with 0
    daysInRange.forEach((day) => {
      results[day] = 0;
    });

    // Increment counts for each action
    actions.forEach((action) => {
      const actionDate = action.timestamp.toString().slice(0, 10);

      if (results[actionDate] !== undefined) {
        results[actionDate] += 1;
      }
    });

    return { data: results };
  }

  async getAllData(timeframe: string) {
    const customers = await this.getCustomerData(timeframe);
    const customerDistribution = await this.getCustomerDistribution(timeframe);
    const totalCustomers = await this.getAlltimeCustomers();
    const apiCalls = await this.getApiCalls(timeframe);

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
