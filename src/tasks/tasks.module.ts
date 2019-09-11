import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';

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
    // Authentication
    // Everything the AuthModule exports is going to be available inside this module.
    // With the following import the application is able to secure routes inside this module.
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
