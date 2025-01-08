import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PubSubService } from './pubsub.service'; // Import PubSubService
import { IApiCall } from '@cloud-porsche/types';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  constructor(private readonly pubSubService: PubSubService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;

    // Log the incoming request
    this.logger.log(`Incoming request: ${method} ${originalUrl}`);

    this.logger.log('Tenant ID of the request:', req.headers['tenant-id'])
    // Call the next middleware or controller handler
    res.on('finish', async () => {
      // After the request is handled, publish the log messagee
      await this.pubSubService.publishMessage({
        messageType: 'apiCall',
        method: method,
        url: originalUrl,
        timestamp: new Date(),
        tenantId: req.headers['tenant-id'],
      });

      this.logger.log(`Message published for ${method} ${originalUrl}`);
    });

    next();
  }
}
