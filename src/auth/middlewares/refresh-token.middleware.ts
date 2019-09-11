import {
  Injectable,
  NestMiddleware,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RefreshTokenService } from '../services/refresh-token.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import * as chalk from 'chalk';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  logger = new Logger('Refresh token middleware');

  constructor(private refreshTokenService: RefreshTokenService) {}

  async use(req: Request, res: Response, next: Function) {
    const token: string = req.headers.authorization.split(' ')[1];
    try {
      await this.refreshTokenService.verifyToken(token);
    } catch (e) {
      res.removeHeader('Authorization');
      throw new UnauthorizedException();
    }
    const decodedToken = await this.refreshTokenService.decode(token);
    const payload: JwtPayload = { username: decodedToken.username };
    const refreshToken: string = await this.refreshTokenService.createRefreshtoken(
      payload,
    );
    res.set('Authorization', 'Bearer ' + refreshToken);
    next();
  }
}
