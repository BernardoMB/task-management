import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

/**
 * Starting point of the application. This is the main module of the application.
 *
 * @export
 * @class AppModule
 */
@Module({
  imports: [
    // Database configuration
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule,
  ],
})
export class AppModule {}
