import {
  ConflictException,
  InternalServerErrorException,
  Logger,
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
  private logger = new Logger('User Repository');
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
      const msg = 'Invalid auth credentials data transfer object';
      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }
    // Create a new instance of User.
    const user = this.create();
    user.username = username;
    user.email = email;
    // Generate the user's random hash.
    user.salt = await bcrypt.genSalt();
    // Create password hash.
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      this.logger.error('Could not save user');
      if (error.code === '23505') {
        // Duplicate username.
        const duplicateKey: string = error.detail.split('(')[1].split(')')[0];
        switch (duplicateKey) {
          case 'email':
            const msgEmail = `Email "${email}" is already in use`;
            this.logger.error(msgEmail);
            throw new ConflictException(msgEmail);
          case 'username':
            const msgUsername = `Username "${username}" is already in use`;
            this.logger.error(msgUsername);
            throw new ConflictException(msgUsername);
        }
      } else {
        this.logger.error(error);
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
    // const user = await this.findOne({ username });
    const res = await this.find({
      where: [{ username }, { email: username }],
    });
    const user = res[0];
    if (user && (await user.validatePassword(password))) {
      this.logger.debug('User found and password is valid');
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
