import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from '../logger/custom-logger.service';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId =
      (req.headers['x-request-id'] as string) || 'unknown-request-id';

    CustomLoggerService.runWithLoggerContext(
      () => {
        next();
      },
      { requestId },
    );
  }
}
