import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
  logger = new Logger('Refresh token service');
  constructor(private readonly jwtService: JwtService) {}
  async createRefreshtoken(payload: any): Promise<string> {
    const refreshToken = await this.jwtService.sign(payload);
    return refreshToken;
  }
  async decode(token: string): Promise<any> {
    const decodedToken = await this.jwtService.decode(token);
    return decodedToken;
  }
  async verifyToken(token: string): Promise<any> {
    const result = await this.jwtService.verify(token);
    return result;
  }
}
