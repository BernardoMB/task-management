import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';

/**
 * This module is used to tell the application about everything related to tasks.
 * It can also import functionality from other modules.
 *
 * @export
 * @class TasksModule
 */
@Module({
  imports: [
    // Database
    TypeOrmModule.forFeature([TaskRepository]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
