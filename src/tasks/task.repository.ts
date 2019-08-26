import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import {
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

/**
 * Task entity repository. This class will hold all the logic needed
 * to perform database transactions regarding tasks.
 *
 * @export
 * @class TaskRepository
 * @extends {Repository<Task>}
 */
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  /**
   * Retreive all user's task from the database.
   *
   * @param {GetTasksFilterDto} filterDto
   * @param {User} user The owner of the task to be retreived.
   * @returns {Promise<Task[]>}
   * @memberof TaskRepository
   */
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    // Using query builder
    const query = this.createQueryBuilder('task');
    // Retreive only tasks owned by the user.
    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }", Filters: ${JSON.stringify(filterDto, null, 2)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  /**
   * This mehtod stores a task asociated to a user.
   *
   * @param {CreateTaskDto} createTaskDto
   * @returns {Promise<Task>}
   * @memberof TaskRepository
   */
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
      return task;
    } catch (error) {
      this.logger.error(
        `Failed to create task for user "${
          user.username
        }". Task: ${JSON.stringify(createTaskDto, null, 2)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  /**
   * Delete a task from the database.
   *
   * @param {number} id Unique identifier of the task to be removed form the database.
   * @param {User} user User trying to delete the task.
   * @returns {Promise<Task>}
   * @memberof TaskRepository
   */
  async deleteTask(id: number, user: User): Promise<Task> {
    const matchingCriteria = {
      id,
      userId: user.id,
    };
    const found = await this.findOne({
      where: matchingCriteria,
    });
    if (!found) {
      throw new NotFoundException(
        `Cannot delete task. Task with ID ${id} not found`,
      );
    }
    const result = await this.delete(id);
    if (result.affected <= 0) {
      throw new Error('Error deleting task');
    }
    return found;
  }
}
