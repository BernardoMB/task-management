import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Task extends BaseEntity {
  /**
   * Unique identifier for a task.
   * The @PrimaryGeneratedColumn() decorator tells the application
   * that the id property is a primary key and it is automatically generated.
   *
   * @type {number}
   * @memberof Task
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;
  /**
   * This property tells the Task entity that there is a many-to-one relationship with the users table.
   *
   * @type {User}
   * @memberof Task
   */
  @ManyToOne(type => User, user => user.tasks, { eager: false })
  user: User;
}
