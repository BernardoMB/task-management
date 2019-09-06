import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

// We do not want to use the real repository because this is unit testing.
// We are testing an insolated unit of code. We do not want to have a database
// connection here. We will have to mock the repository meaning that we have
// to create a new object that simulates the task repository according to the
// tests. So we have to define the following factory function that simply
// return an object.
const mockTaskRepository = () => ({});

// Testing something that is part of the NestJS ecosystem.
describe('TaskService', () => {
  // The only external dependency the task service
  // interacts with is the task repository so we need it here.
  let tasksService;
  let taskRepository;

  // Before every test we want to reinitilize the service and the repository.
  beforeEach(async () => {
    // Create a new module. It takes time so it is called with await.
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();
    // Once the module is compiled we can assign the task service variable
    tasksService = await module.get<TasksService>(TasksService);
    // We do no want to use the real repository because this is testing. We need to use a mock repository.
  });
});
