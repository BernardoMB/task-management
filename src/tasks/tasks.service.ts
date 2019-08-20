import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

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

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<Task> {
    return this.taskRepository.deleteTask(id);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const found = await this.getTaskById(id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    found.status = status;
    await found.save();
    return found;
  }
}
