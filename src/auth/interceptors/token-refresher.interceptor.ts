import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { RefreshTokenService } from '../services/refresh-token.service';

@Injectable()
export class TokenRefresherInterceptor implements NestInterceptor {
  logger = new Logger('Interceptor');
  constructor(private refreshTokenService: RefreshTokenService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (request.user) {
      const payload: JwtPayload = { username: request.user.username };
      const refreshToken: string = await this.refreshTokenService.createRefreshtoken(
        payload,
      );
      const response = context.switchToHttp().getResponse();
      this.logger.verbose('Created new token');
      response.set('Authorization', 'Bearer ' + refreshToken);
    }
    return next.handle();
  }
}
