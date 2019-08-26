import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

/**
 * This injectable class is the service that hanldes the business logic of the application related to taks.
 *
 * @export
 * @class TasksService
 */
@Injectable()
export class TasksService {
  // private tasks: Task[] = [];

  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  /* getAllTasks(): Task[] {
    return this.tasks;
  } */
  /* getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  } */

  /**
   * Get all tasks owned by a user.
   *
   * @param {GetTasksFilterDto} filterDto Task filters.
   * @param {User} user The user requesting the tasks.
   * @returns {Promise<Task[]>}
   * @memberof TasksService
   */
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  /**
   * Get a task by id.
   *
   * @param {number} id The unique identifier of the task.
   * @param {User} user The user that is requesting the task.
   * @returns {Promise<Task>}
   * @memberof TasksService
   */
  async getTaskById(id: number, user: User): Promise<Task> {
    const matchingCriteria = {
      id,
      userId: user.id,
    };
    const found = await this.taskRepository.findOne({
      where: matchingCriteria,
    });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  /**
   * Create a task asociated with a user.
   *
   * @param {CreateTaskDto} createTaskDto
   * @returns {Promise<Task>}
   * @memberof TasksService
   */
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  /**
   * Delete a task.
   *
   * @param {number} id Unique identifier of the task to be deleted.
   * @param {*} user User trying to delete the task.
   * @returns {Promise<Task>}
   * @memberof TasksService
   */
  async deleteTask(id: number, user: User): Promise<Task> {
    return this.taskRepository.deleteTask(id, user);
  }

  /**
   * Update task status.
   *
   * @param {number} id Unique identifier of the task to be updated.
   * @param {TaskStatus} status New task status.
   * @param {User} user The user trying to update the task.
   * @returns {Promise<Task>}
   * @memberof TasksService
   */
  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const found = await this.getTaskById(id, user);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    found.status = status;
    await found.save();
    return found;
  }
}
