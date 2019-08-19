import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

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
