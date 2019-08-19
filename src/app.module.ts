import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

/**
 * Starting point of the application. This is the main module of the application.
 *
 * @export
 * @class AppModule
 */
@Module({
  imports: [TasksModule],
})
export class AppModule {}
