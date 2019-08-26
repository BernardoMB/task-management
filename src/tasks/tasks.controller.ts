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
   * Also, this function is decorated using the @GetUser() on the user parameter in
   * order to make available the user who made the request inside the function.
   * Note: the @GetUser() decorator is able to retreive the user from the request
   * object because it was previously injected via the validate method thanks to the
   * @UseGuards(AuthGuard()) at a controller level.
   *
   * @param {GetTasksFilterDto} filterDto
   * @param {User} user
   * @returns {Promise<Task[]>}
   * @memberof TasksController
   */
  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }

  /**
   * This function is decorated using the @GetUser() on the user parameter in
   * order to make available the user who made the request inside the function.
   * Note: the @GetUser() decorator is able to retreive the user from the request
   * object because it was previously injected via the validate method thanks to the
   * @UseGuards(AuthGuard()) at a controller level.
   *
   * @param {number} id The unique identifier of the task.
   * @param {User} user The user that owns the task.
   * @returns {Promise<Task>}
   * @memberof TasksController
   */
  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    // Alternatively, you can extract all url parameters into a single object
    // @Param() params: any
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  /**
   * This method allow users to create tasks.
   * The insertion of the @GetUser() decorator will make the user object available inside the method.
   * Note: This user object was injected via the validate method executed thanks to the
   * controller's @UseGuards(AuthGuard()) decorator.
   *
   * @param {CreateTaskDto} createTaskDto
   * @param {User} user
   * @returns {Promise<Task>}
   * @memberof TasksController
   */
  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    // Alternatively, you can extract only certain values from the body
    // specifiying the name of the key inside the body as an argument of the @Body() decorator.
    // @Body('title') title: string,
    // @Body('description') description: string
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  /**
   * Delete a task.
   * This function is decorated using the @GetUser() on the user parameter in
   * order to make available the user who made the request inside the function.
   * Note: the @GetUser() decorator is able to retreive the user from the request
   * object because it was previously injected via the validate method thanks to the
   * @UseGuards(AuthGuard()) at a controller level.
   *
   * @param {number} id Unique identifier of the task to be deleted.
   * @param {User} user The user trying to delete the task.
   * @returns {Promise<Task>}
   * @memberof TasksController
   */
  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.deleteTask(id, user);
  }

  /**
   * Update task status.
   * This function is decorated using the @GetUser() on the user parameter in
   * order to make available the user who made the request inside the function.
   * Note: the @GetUser() decorator is able to retreive the user from the request
   * object because it was previously injected via the validate method thanks to the
   * @UseGuards(AuthGuard()) at a controller level.
   *
   * @param {number} id The unique identifier of the task to be updated.
   * @param {TaskStatus} status The new task status.
   * @param {User} user The user that tries to update the task.
   * @returns {Promise<Task>}
   * @memberof TasksController
   */
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
