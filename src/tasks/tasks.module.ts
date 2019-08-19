import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

/**
 * This module is used to tell the application about everything related to tasks.
 * It can also import functionality from other modules.
 *
 * @export
 * @class TasksModule
 */
@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
