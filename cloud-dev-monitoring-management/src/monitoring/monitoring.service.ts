import { Injectable, Logger } from '@nestjs/common';
import { ApiCall } from './entities/api-call.entity';
import { getRepository } from 'fireorm';
import { ParkingAction } from './entities/parking-action-entity';
import { Tenant } from './entities/tenant.entity';
import { addDays, subDays } from 'date-fns';
import { PubSub } from '@google-cloud/pubsub';
import { getFirestore } from 'firebase-admin/firestore';
import { getApp } from 'firebase-admin/app';
import { TenantTier } from '@cloud-porsche/types';
import { ConfigService } from '@nestjs/config';
import { DefectAction } from './entities/defect-action.entity';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  private tenantDb = getFirestore(getApp('tenant'));
  private apiCallRepository = getRepository(ApiCall);
  private parkingActionRepository = getRepository(ParkingAction);
  private defectActionRepository = getRepository(DefectAction);
  private pubSubClient: PubSub;
  private subscriptionName = process.env.QUEUE_SUBSCRIPTION;

  constructor(private config: ConfigService) {
    this.pubSubClient = new PubSub({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
      },
    });
    this.listenForMessages();
  }

  private listenForMessages() {
    const subscription = this.pubSubClient.subscription(this.subscriptionName);

    subscription.on('message', (message) => {
      const data = JSON.parse(message.data.toString());
      const { messageType, ...payload } = data;


      if(messageType === 'parking') {
        this.parkingActionRepository.create(payload)
      } else if(messageType === 'apiCall') {
        this.apiCallRepository.create(payload)
      } else if(messageType === 'defect') {
        this.defectActionRepository.create(payload)
      }

      message.ack();
    });

    subscription.on('error', (error) => {
      this.logger.error('Error receiving message:', error);
    });

    this.logger.log(
      `Listening for messages on subscription: ${this.subscriptionName}`,
    );
  }

  private calculateDateRanges(timeframe: string): {
    currentStart: Date;
    previousStart: Date;
    currentEnd: Date;
    previousEnd: Date;
  } {
    const now = new Date();
    let currentStart: Date, previousStart: Date;

    switch (timeframe) {
      case 'total':
        currentStart = subDays(now, 365 * 3);
        previousStart = subDays(now, 365 * 6);
        break;
      case 'yearly':
        currentStart = subDays(now, 364);
        previousStart = subDays(now, 365 * 2);
        break;
      case 'monthly':
        currentStart = subDays(now, 29);
        previousStart = subDays(now, 59);
        break;
      case 'weekly':
        currentStart = subDays(now, 6);
        previousStart = subDays(now, 13);
        break;
      default:
        throw new Error(
          'Invalid timeframe. Use total, yearly, monthly, or weekly.',
        );
    }

    return {
      currentStart,
      previousStart,
      currentEnd: now,
      previousEnd: subDays(currentStart, 1),
    };
  }

  private calculatePercentChange(current: number, previous: number): number {
    return previous !== 0 ? ((current - previous) / previous) * 100 : 0;
  }

  async getCustomerCount(timeframe: string, parkingActions: ParkingAction[]) {
    const { currentStart, currentEnd, previousStart, previousEnd } =
      this.calculateDateRanges(timeframe);

    const current = parkingActions.filter(
      (action) =>
        action.action == 'enter' &&
        new Date(action.timestamp) >= currentStart &&
        new Date(action.timestamp) <= currentEnd,
    ).length;

    const previous = parkingActions.filter(
      (action) =>
        action.action == 'enter' &&
        new Date(action.timestamp) >= previousStart &&
        new Date(action.timestamp) <= previousEnd,
    ).length;

    return {
      current_period_customers: current,
      previous_period_customers: previous,
      percent_change: this.calculatePercentChange(current, previous),
    };
  }

  async getApiCalls(timeframe: string, apiCalls: ApiCall[]) {
    const { currentStart, currentEnd, previousStart, previousEnd } =
      this.calculateDateRanges(timeframe);

    const current = apiCalls.filter(
      (call) =>
        new Date(call.timestamp) >= currentStart &&
        new Date(call.timestamp) <= currentEnd,
    ).length;

    const previous = apiCalls.filter(
      (call) =>
        new Date(call.timestamp) >= previousStart &&
        new Date(call.timestamp) <= previousEnd,
    ).length;

    return {
      current_period_api_calls: current,
      previous_period_api_calls: previous,
      percent_change: this.calculatePercentChange(current, previous),
    };
  }

  async getParkingIncome(timeframe: string, parkingActions: ParkingAction[]) {
    const filterFn = (action: ParkingAction) => action.action === 'free';
    const { currentStart, currentEnd, previousStart, previousEnd } =
      this.calculateDateRanges(timeframe);

    const calculateIncome = (start: Date, end: Date) =>
      parkingActions
        .filter(
          (action) =>
            filterFn(action) &&
            new Date(action.timestamp) >= start &&
            new Date(action.timestamp) <= end,
        )
        .reduce(
          (total, action) =>
            total + action.costPerHour * action.parkingDuration,
          0,
        );

    const current = calculateIncome(currentStart, currentEnd);
    const previous = calculateIncome(previousStart, previousEnd);

    return {
      current_period_income: current,
      previous_period_income: previous,
      percent_change: this.calculatePercentChange(current, previous),
    };
  }

  async getCustomerDistribution(
    timeframe: string,
    parkingActions: ParkingAction[],
  ): Promise<Record<string, number>> {
    const startDate = this.calculateDateRanges(timeframe).currentStart;
    return parkingActions
      .filter(
        (action) =>
          action.action === 'enter' && new Date(action.timestamp) >= startDate,
      )
      .reduce(
        (distribution, action) => {
          distribution[action.propertyName] =
            (distribution[action.propertyName] || 0) + 1;
          return distribution;
        },
        {} as Record<string, number>,
      );
  }

  async getCustomerData(timeframe: string, parkingActions: ParkingAction[]) {
    const startDate = this.calculateDateRanges(timeframe).currentStart;
    const dateRange = this.generateDateRange(startDate, new Date());

    const enterActions = parkingActions.filter(
      (action) => action.action === 'enter',
    );
    return this.aggregateByDay(enterActions, dateRange);
  }

  async getDailyAvgUtilization(
    timeframe: string,
    parkingActions: ParkingAction[],
  ): Promise<Record<string, Record<string, number>>> {
    const { currentStart, currentEnd } = this.calculateDateRanges(timeframe);

    const dateRange = this.generateDateRange(currentStart, currentEnd);

    const avgUtilization: Record<string, Record<string, number>> = {};

    const freeActions = parkingActions.filter(
      (action) => action.action === 'occupy',
    );
    const groupedActions = freeActions.reduce(
      (acc, action) => {
        const actionDate = action.timestamp.toString().slice(0, 10);
        if (!acc[action.propertyName]) {
          acc[action.propertyName] = {};
        }
        if (!acc[action.propertyName][actionDate]) {
          acc[action.propertyName][actionDate] = [];
        }
        acc[action.propertyName][actionDate].push(action);
        return acc;
      },
      {} as Record<string, Record<string, ParkingAction[]>>,
    );

    dateRange.forEach((day) => {
      for (const propertyName of Object.keys(groupedActions)) {
        if (!avgUtilization[propertyName]) {
          avgUtilization[propertyName] = {};
        }
        const actionsForDay = groupedActions[propertyName][day] || [];

        avgUtilization[propertyName][day] =
          actionsForDay.length > 0
            ? actionsForDay.reduce(
                (sum, action) => sum + action.currentUtilization,
                0,
              ) / actionsForDay.length
            : 0;
      }

      for (const propertyName of Object.keys(avgUtilization)) {
        if (!avgUtilization[propertyName][day]) {
          avgUtilization[propertyName][day] = 0;
        }
      }
    });

    return avgUtilization;
  }

  private async getLeftFreeApiCalls(
    timeframe: string,
    tenant: Tenant,
    apiCalls: ApiCall[],
  ) {
    const tenantTierLimit = (() => {
      switch (tenant.tier) {
        case TenantTier.FREE:
          return this.config.get('TENANT_TIER_FREE_LIMIT', 1000);
        case TenantTier.PRO:
          return this.config.get('TENANT_TIER_PRO_LIMIT', 100000);
        case TenantTier.ENTERPRISE:
          return this.config.get('TENANT_TIER_ENTERPRISE_LIMIT', 1000000);
        default:
          throw new Error('Invalid tenant tier');
      }
    })();
    const currApiCalls = await this.getApiCalls(timeframe, apiCalls);
    const leftApiCalls =
      parseInt(tenantTierLimit, 10) - currApiCalls.current_period_api_calls;
    return leftApiCalls > 0 ? leftApiCalls : 0;
  }

  private async getDefectDistribution(
    timeframe: string,
    defectActions: DefectAction[],
  ) {
    
  }

  private generateDateRange(startDate: Date, endDate: Date): string[] {
    const range: string[] = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      range.push(currentDate.toISOString().slice(0, 10));
      currentDate = addDays(currentDate, 1);
    }
    return range;
  }

  private aggregateByDay(
    actions: ParkingAction[],
    daysInRange: string[],
  ): Record<string, number> {
    return daysInRange.reduce(
      (acc, day) => {
        acc[day] = actions.filter(
          (action) => action.timestamp.toString().slice(0, 10) === day,
        ).length;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async getAllData(tenantId: string, timeframe: string) {
    const allParkingActions = await this.parkingActionRepository
      .whereEqualTo('tenantId', tenantId)
      .find();
    const allApiCalls = await this.apiCallRepository
      .whereEqualTo('tenantId', tenantId)
      .find();
    const allDefectActions = await this.defectActionRepository.whereEqualTo('tenantId', tenantId).find();
    
    let tenant = (
      await this.tenantDb.collection('Tenants').doc(tenantId).get()
    ).data() as Tenant;
    if (!tenant) {
      tenant = (
        await this.tenantDb.collection('Tenants').doc('free').get()
      ).data() as Tenant;
    }

    const [
      customers,
      customerDistribution,
      apiCalls,
      customerCount,
      parkingIncome,
      avgUtilization,
      leftFreeApiCalls,
      defectDistribution,
    ] = await Promise.all([
      this.getCustomerData(timeframe, allParkingActions),
      this.getCustomerDistribution(timeframe, allParkingActions),
      this.getApiCalls(timeframe, allApiCalls),
      this.getCustomerCount(timeframe, allParkingActions),
      this.getParkingIncome(timeframe, allParkingActions),
      this.getDailyAvgUtilization(timeframe, allParkingActions),
      this.getLeftFreeApiCalls('monthly', tenant, allApiCalls),
      this.getDefectDistribution(timeframe, allDefectActions),
    ]);

    return {
      data: {
        customers: customers,
        customer_distribution: customerDistribution,
        api_calls: apiCalls,
        customer_count_change: customerCount,
        parking_income: parkingIncome,
        avg_utilization: avgUtilization,
        left_free_api_calls: leftFreeApiCalls,
      },
    };
  }
}
