import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import * as config from 'config';
import { RefreshTokenService } from './services/refresh-token.service';
import { TokenRefresherInterceptor } from './interceptors/token-refresher.interceptor';

const jwtConfig = config.get('jwt');

/**
 * This module lets the application to issue *tokens* for the
 * authenticated clients so they can send them along with
 * every request they make without having to send their credentials
 * to prove that they are who they say they are.
 *
 * This authentication module uses Json Web Token (JWT) authentication
 * with a defined strategy to handle user's tokens and authentication.
 * The Json Web Tokens issued by the application have 3 components:
 * 1. **Header**: Contains metadata about the token (type, hashing algorithm, etc).
 * 2. **Payload**: Contains claims (statements about an entity - for example, a user) and additional data.
 * 3. **Signature**: Is the result of the encoded the header, the payload, signed againsts a secret. Also,
 * it certifies that only the party holding the private key is the one that signed it.
 *
 * @export
 * @class AuthModule
 */
@Module({
  imports: [
    // Authentication strategy (how routes are secured/authenticated).
    // This module needs to be imported in order to
    // a) Help us export the strategy (jwt.strategy) to other modules in order to
    // secure the application.
    // b) Enables the use of AuthGuards (which are also decorators used in controllers)
    // application wide.
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // The JwtModule makes available the JwtService that is used
    // (via constructor injection) to create signed tokens.
    // This module is only used to create the token with its 3 components (create a signed token).
    // It is like an utility module that is only used inside this authentication module.
    // This entire package should be removed if you want to issue several types of tokens
    // signed with different secrets. More on this in the Chapell Hill Denham back back-end.
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    // Users database entity configuration.
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    /**
     * The JwtStrategy is declared here as a provider
     * because there are dummy routes that are authenticated.
     * Normally, the JwtStrategy should not need to be declared
     * as a provide here, but in order modules.
     */
    JwtStrategy,
    RefreshTokenService,
    TokenRefresherInterceptor,
  ],
  exports: [
    /**
     * Export the PassportModule so other modules of this application
     * can use the @AuthGuard() decorator in their routes handlers in
     * order to secure their resourses.
     */
    PassportModule,
    /**
     * Export the JwtStrategy so @AuthGuard() decorators in other modules
     * know how to extract, verify and decode the tokens that get sent on
     * every request in order to validate them.
     *
     * The PassportModule and the JwtStrategy are tied together.
     */
    JwtStrategy,
    /**
     * Export the RefreshTokenService so route sin other modules can
     * send a new token in their responses.
     */
    RefreshTokenService,
    /**
     * Export the RefreshTokenService so route sin other modules can
     * send a new token in their responses.
     */
    TokenRefresherInterceptor,
  ],
})
export class AuthModule {}
