import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import * as config from 'config';

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
  providers: [AuthService, JwtStrategy],
  // Export the JwtStrategy along with it's module to
  // let other modules secure their resourses.
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
