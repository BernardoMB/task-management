import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

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
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    // Using query builder
    const query = this.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }

  async deleteTask(id: number): Promise<Task> {
    const found = await this.findOne(id);
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
