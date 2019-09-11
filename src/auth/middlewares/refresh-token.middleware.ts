import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  logger = new Logger('Refresh token middleware');
  use(req: Request, res: Response, next: Function) {
    this.logger.debug(`Response status ${res.status}`);
    next();
  }
}
