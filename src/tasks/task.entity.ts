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
   * Define the user-tasks relationship.
   * The raltions of the relational database are defined inside entities.
   * This property tells the Task entity that there is a many-to-one relationship with the users table.
   *
   * @type {User}
   * @memberof Task
   */
  @ManyToOne(type => User, user => user.tasks, { eager: false })
  user: User;
  /**
   * The unique identifier of the user that owns the task.
   *
   * @type {number}
   * @memberof Task
   */
  @Column()
  userId: number;
}
