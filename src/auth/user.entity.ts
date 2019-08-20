import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
// Specify the array of column names that must be unique.
// This validation occurs in the database.
@Unique(['username'])
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  salt: string;
  // Instance methods
  async validatePassword(password: string): Promise<boolean> {
    const user = this; // 'this' points to the actual user stored in the database
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
  }
}
