import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

/**
 * Any incoming request to /tasks will be handled by this controller thanks to the controller decorator.
 * With the AuthGuard() passed on into the @UserGuards() decorator
 * this entire controller is guarded.
 * This means that every route inside this controller requires propper authentication.
 *
 * @export
 * @class TasksController
 */
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  /**
   * Creates an instance of TasksController.
   * Tasks service can be injected here because it a TypeScript class with the injectable decorator.
   * @param {TasksService} tasksService
   * @memberof TasksController
   */
  constructor(private tasksService: TasksService) {}

  /**
   * Handles the GET tasks/ request.
   * This function is decorated with the UsePipes passing the ValidationPipe.
   * his means that every parameter passed on to the function will be validated
   * againts is given type using the validation pipes inside the class used as a type.
   *
   * @param {GetTasksFilterDto} filterDto
   * @returns {Task[]}
   * @memberof TasksController
   */
  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    // Alternatively, you can extract all url parameters into a single object
    // @Param() params: any
  ): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    // Alternatively, you can extract only certain values from the body
    // specifiying the name of the key inside the body as an argument of the @Body() decorator.
    // @Body('title') title: string,
    // @Body('description') description: string
    @GetUser() user: User, // Give me the user from the request object. The user is already present in the request thanks to
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
