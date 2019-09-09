import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

const mockUser = {
  id: 12,
  username: 'Probonsio',
  email: 'probonsio@testing.com',
};

// (5)
// We do not want to use the real repository because this is unit testing.
// We are testing an insolated unit of code. We do not want to have a database
// connection here. We will have to mock the repository meaning that we have
// to create a new object that simulates the task repository according to the
// tests. So we have to define the following factory function that simply
// returns an object.
const mockTaskRepository = () => ({
  // (10)
  // Specify the function that you want to use.
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});
// Arrow functions, like function expressions, can be used to return an object literal expression.
// The only caveat is that the body needs to be wrapped in parentheses,
// in order to distinguish between a block and an object(both of which use curly brackets).
// Example:
/* //ES5
var setNameIdsEs5 = function setNameIds(id, name) {
    return {
        id: id,
        name: name
    };
};
// ES6
var setNameIdsEs6 = (id, name) => ({ id: id, name: name });
console.log(setNameIdsEs6(4, "Kyle"));   // Object {id: 4, name: "Kyle"} */

// (1)
// Testing something that is part of the NestJS ecosystem.
// In this application, the task service is part of the NestJS ecosystem.
// Therefore, this describe block will test something that is part of the NestJs Ecosystem.
// This describe block will use the NestJS testing module.
describe('TaskService', () => {
  // (2)
  // Define the variables that are going to be used in this tests.
  // The task service only uses itself and the task repository.
  let tasksService;
  // The only external dependency the task service
  // interacts with is the task repository so we need it here.
  let taskRepository;

  // (3)
  // Before every test the service and the repository must be initilized
  // because each test is independent from one another.
  beforeEach(async () => {
    // Create a new NestJS testing module (module for testing).
    // Creating a new testing module takes time so it is called with await.
    // The original task module has a lot of things that should not be used
    // here, sush as the connection with the database. Therefore a new
    // module must be created without all unecessary functionality.
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        // (6) Provide the mock task repository.
        // TaskRepository // This will use the real repository, instead use the following object
        // to provide the mock repository:
        { provide: TaskRepository, useFactory: mockTaskRepository },
        // useFactory is provided because the test module will create the repository over and over.
      ],
    }).compile();
    // (4)
    // Use the task service provided in the testing module once the testing
    // module is compile.
    tasksService = await module.get<TasksService>(TasksService);
    // We do no want to use the real repository because this is testing. We need to use a mock repository.

    // (7)
    // Now the mock task repository can be used.
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  // (8)
  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      // (9) Here we want to test a function from the mock repository, so the mock repository
      // must declare that.

      // (11)
      // Use the mock function of the mock repository.
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      // Specify the resolved value for the mock function being tested here.
      // The mock function being tested here return a promise. Specify the value returned
      // from the promise.
      taskRepository.getTasks.mockResolvedValue('someValue');

      // (12)
      // test something else.
      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalledTimes(1);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and succesfully retrieve and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc' };
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });
    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      const result = tasksService.getTaskById(1, mockUser);
      expect(result).rejects.toThrow();
      expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const mockTask = {
        id: 1,
        title: 'Some title',
        description: 'Some description.',
        status: TaskStatus.IN_PROGRESS,
        user: mockUser,
      };
      taskRepository.createTask.mockResolvedValue(mockTask);
      const createTaskDto: CreateTaskDto = {
        title: 'Some title',
        description: 'Some description',
      };
      const result = await tasksService.createTask(createTaskDto, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
