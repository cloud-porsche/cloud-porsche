import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PubSubService } from './pubsub.service'; // Import PubSubService
import { IApiCall } from '@cloud-porsche/types';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  constructor(private readonly pubSubService: PubSubService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    // Log the incoming request
    this.logger.log(`Incoming request: ${method} ${originalUrl}`);

    // Call the next middleware or controller handler
    res.on('finish', async () => {
      // After the request is handled, publish the log message
      await this.pubSubService.publishMessage({
        messageType: 'apiCall',
        method: method,
        url: originalUrl,
        timestamp: new Date(),
      });
    });

    next();
  }
}
