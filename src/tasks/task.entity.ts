import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TaskStatus } from './task-status.enum';

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
}
