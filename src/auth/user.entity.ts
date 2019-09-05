import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import * as bcrypt from 'bcryptjs';

/**
 * User database entity.
 *
 * @export
 * @class User
 * @extends {BaseEntity}
 */
@Entity()
// Specify the array of column names that must be unique.
// This validation occurs in the database.
@Unique(['username'])
@Unique(['email'])
export class User extends BaseEntity {
  /**
   * User's unique identifier.
   *
   * @type {number}
   * @memberof User
   */
  @PrimaryGeneratedColumn()
  id: number;
  /**
   * The user's unique username.
   *
   * @type {string}
   * @memberof User
   */
  @Column()
  username: string;
  /**
   * The email of the user.
   *
   * @type {string}
   * @memberof User
   */
  @Column()
  email: string;
  /**
   * The passwords are hashed and the hash value is stored.
   * Password should never be stored as plain text.
   *
   * @type {string}
   * @memberof User
   */
  @Column()
  password: string;
  /**
   * Salt is necesary to hash the user's password.
   *
   * @type {string}
   * @memberof User
   */
  @Column()
  salt: string;
  /**
   * Define a the user-tasks relationship.
   * Entity relations are defined here.
   * The following property help us retreive all the tasks a user owns.
   * Eager set to true means that user.tasks notation can be used to get user's tasks.
   *
   * @type {Task[]}
   * @memberof User
   */
  @OneToMany(type => Task, task => task.user, { eager: true })
  tasks: Task[];
  /**
   * This method cheks if the password passed matches the user password.
   *
   * @param {string} password Plain password string
   * @returns {Promise<boolean>} Whether the passed password is valid or not
   * @memberof User
   */
  async validatePassword(password: string): Promise<boolean> {
    const user = this; // 'this' points to the actual user stored in the database
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
  }
}
