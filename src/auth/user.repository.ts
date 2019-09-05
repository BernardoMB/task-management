import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';

/**
 * This class handles the comunication with the database regarding
 * users.
 *
 * @export
 * @class UserRepository
 * @extends {Repository<User>}
 */
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * Sign up a user.
   * This methods tells the database to store a new user.
   *
   * @param {AuthCredentialsDto} authCredentialsDto
   * @returns {Promise<void>}
   * @memberof UserRepository
   */
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, email, password } = authCredentialsDto;
    if (!username || !email || !password) {
      throw new InternalServerErrorException(
        'Invalid auth credentials data transfer object',
      );
    }
    const user = new User();
    user.username = username;
    user.email = email;
    // Generate the user's random hash.
    user.salt = await bcrypt.genSalt();
    // Create password hash.
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate username.
        const duplicateKey: string = error.detail.split('(')[1].split(')')[0];
        switch (duplicateKey) {
          case 'email':
            throw new ConflictException(`Email "${email}" is already in use`);
          case 'username':
            throw new ConflictException(
              `Username "${username}" is already in use`,
            );
        }
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Returns the username if the password is valid.
   *
   * @param {AuthCredentialsDto} authCredentialsDto
   * @returns {Promise<string>}
   * @memberof UserRepository
   */
  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  /**
   * This method creates a password hash using a salt.
   *
   * @private
   * @param {string} pass
   * @param {string} salt
   * @returns {Promise<string>}
   * @memberof UserRepository
   */
  private async hashPassword(pass: string, salt: string): Promise<string> {
    return bcrypt.hash(pass, salt);
  }
}
