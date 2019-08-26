import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

/**
 * This class going to be used to authenticate the user and retreive it using the
 * token that gets sent on every incoming request from a client.
 * In order to do so, the application must use the Passport JWT Strategy from the passport-jwt package.
 * Because this a NestJS application the Passport JWT Strategy is implemented extending functionality
 * from the PassportStrategy class from the @nestjs/passport package.
 *
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy.
   * This constructor configures the class from which this class extends functionality.
   * It configures the PassportStrategy which uses the Strategy from the passport-jwt package.
   *
   * @param {UserRepository} userRepository
   * @memberof JwtStrategy
   */
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    // Configure the startegy to retrieve the token from the herader of the request.
    super({
      // Define how the jwt token is extracted form the request.
      // The application needs this token in order to authenticate the user.
      // Extracting the token from the header is a common practice.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Define the secrete used in the module configuration.
      // This is the secret that Passport is going to use to verify the signatire of the token that is extracted form the request.
      secretOrKey: 'cualquiermamaxd666',
    });
  }

  /**
   * This method must exist for every strategy.
   * First, the Passport JWT Strategy is going to verify the signature of the extracted
   * token using the secret provided in the secretOrKey of the strategy's configuration object.
   * If the signature is not valid, then an error is thrown.
   * If the signature is valid, then this method is called passing the payload of the token.
   *
   * @param {JwtPayload} payload This payload is already verified at this point
   * (by the moment this function gets executed, the signature of the token has already
   * been verified using the secret provided in the super contructor above).
   * @returns {Promise<User>} Whatever this method returns gets injected in the request
   * for every guarded route.
   * @memberof JwtStrategy
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload; // Estract the username from the token playload.
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
