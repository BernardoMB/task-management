import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

/**
 * This class handles the business logic regarding users.
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   * @param {UserRepository} userRepository
   * @param {JwtService} jwtService
   * @memberof AuthService
   */
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    // JwtModule allow us to inject the JwtService inside this constructor.
    // With the JwtService the application can create, sign and validate the tokens.
    private jwtService: JwtService,
  ) {}

  /**
   * Sign up users.
   *
   * @param {AuthCredentialsDto} authCredentialsDto
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  /**
   * This mehtod handles the sign in request.
   * If the user is succesfully authenticated, then a token must be
   * issued in order to return it to the user so the user's client
   * application can send this token along with every request.
   *
   * @param {AuthCredentialsDto} authCredentialsDto
   * @returns {Promise<{ accessToken: string }>}
   * @memberof AuthService
   */
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Define the payload of the token for token creation.
    // This payload should not include sensitive information.
    // This payload may include the user's role so the client
    // application can determine its behaviour.
    const payload: JwtPayload = {
      username,
    };
    // Create the token.
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
