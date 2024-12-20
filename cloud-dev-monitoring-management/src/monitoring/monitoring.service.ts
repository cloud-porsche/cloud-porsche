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
        return subDays(now, 364);
      case 'monthly':
        return subDays(now, 30);
      case 'weekly':
        return subDays(now, 6);
      default:
        throw new Error(
          'Invalid timeframe. Use total, yearly, monthly, or weekly.',
        );
    }
  }

  // New Method to get the customer count and percent change
  async getCustomerCountChange(timeframe: string) {
    const now = new Date();

    // Helper function to get the start date based on the timeframe
    const getStartDate = (offset: number): Date => {
      return subDays(now, offset);
    };

    let currentStartDate: Date;
    let previousStartDate: Date;
    let currentEndDate: Date = now;
    let previousEndDate: Date;

    switch (timeframe) {
      case 'total':
        currentStartDate = getStartDate(365 * 3);
        previousStartDate = getStartDate(365 * 6); // 3 years ago
        break;
      case 'yearly':
        currentStartDate = getStartDate(364);
        previousStartDate = getStartDate(365 * 2); // 1 year ago
        break;
      case 'monthly':
        currentStartDate = getStartDate(29);
        previousStartDate = getStartDate(59); // 1 month ago
        break;
      case 'weekly':
        currentStartDate = getStartDate(6);
        previousStartDate = getStartDate(13); // 1 week ago
        break;
      default:
        throw new Error(
          'Invalid timeframe. Use total, yearly, monthly, or weekly.',
        );
    }
    previousEndDate = subDays(currentStartDate, 1);

    // Fetch the parking actions for current and previous periods
    const parkingActions = await this.parkingActionRepository.find();

    const currentPeriodCustomers = parkingActions.filter(
      (action) =>
        action.action === 'enter' &&
        new Date(action.timestamp) >= currentStartDate &&
        new Date(action.timestamp) <= currentEndDate,
    ).length;

    let previousPeriodCustomers = parkingActions.filter(
      (action) =>
        action.action === 'enter' &&
        new Date(action.timestamp) >= previousStartDate &&
        new Date(action.timestamp) <= previousEndDate,
    ).length;

    previousPeriodCustomers = 104;
    // Calculate the percentage change
    let percentChange = 0;
    if (previousPeriodCustomers !== 0) {
      percentChange =
        ((currentPeriodCustomers - previousPeriodCustomers) /
          previousPeriodCustomers) *
        100;
    }

    return {
      current_period_customers: currentPeriodCustomers,
      previous_period_customers: previousPeriodCustomers,
      percent_change: percentChange,
    };
  }

  // Existing Method to get the API calls and percent change
  async getApiCalls(timeframe: string) {
    const now = new Date();

    const getStartDate = (offset: number): Date => {
      return subDays(now, offset);
    };

    let currentStartDate: Date;
    let previousStartDate: Date;
    let currentEndDate: Date = now;
    let previousEndDate: Date;

    switch (timeframe) {
      case 'total':
        currentStartDate = getStartDate(365 * 3);
        previousStartDate = getStartDate(365 * 6); // 3 years ago
        break;
      case 'yearly':
        currentStartDate = getStartDate(364);
        previousStartDate = getStartDate(365 * 2); // 1 year ago
        break;
      case 'monthly':
        currentStartDate = getStartDate(29);
        previousStartDate = getStartDate(59); // 1 month ago
        break;
      case 'weekly':
        currentStartDate = getStartDate(6);
        previousStartDate = getStartDate(13); // 1 week ago
        break;
      default:
        throw new Error(
          'Invalid timeframe. Use total, yearly, monthly, or weekly.',
        );
    }
    previousEndDate = subDays(currentStartDate, 1);

    const apiCalls = await this.apiCallRepository.find();

    const currentPeriodApiCalls = apiCalls.filter(
      (apiCall) =>
        new Date(apiCall.timestamp) >= currentStartDate &&
        new Date(apiCall.timestamp) <= currentEndDate,
    ).length;

    const previousPeriodApiCalls = apiCalls.filter(
      (apiCall) =>
        new Date(apiCall.timestamp) >= previousStartDate &&
        new Date(apiCall.timestamp) <= previousEndDate,
    ).length;

    let percentChange = 0;
    if (previousPeriodApiCalls !== 0) {
      percentChange =
        ((currentPeriodApiCalls - previousPeriodApiCalls) /
          previousPeriodApiCalls) *
        100;
    }

    return {
      current_period_api_calls: currentPeriodApiCalls,
      previous_period_api_calls: previousPeriodApiCalls,
      percent_change: percentChange,
    };
  }

  // Existing Method to get customer distribution
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

  // Existing Method to get customer data
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

  // Existing Method to get all-time customers
  async getAlltimeCustomers(): Promise<number> {
    const parkingActions = await this.parkingActionRepository.find();
    return parkingActions.filter((action) => action.action === 'enter').length;
  }

  // Updated Method to get all data (including customer count change)
  async getAllData(timeframe: string) {
    const [
      customers,
      customerDistribution,
      totalCustomers,
      apiCalls,
      customerCountChange,
    ] = await Promise.all([
      this.getCustomerData(timeframe),
      this.getCustomerDistribution(timeframe),
      this.getAlltimeCustomers(),
      this.getApiCalls(timeframe),
      this.getCustomerCountChange(timeframe), // Adding customer count change
    ]);

    return {
      data: {
        customers: customers.data,
        customer_distribution: customerDistribution,
        total_customers: totalCustomers,
        api_calls: apiCalls,
        customer_count_change: customerCountChange, // Returning the customer count change
      },
    };
  }
}
