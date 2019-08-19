import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';

/**
 * Task entity repository. This class will hold all the logic needed
 * to perform database transactions regarding tasks.
 *
 * @export
 * @class TaskRepository
 * @extends {Repository<Task>}
 */
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {}
