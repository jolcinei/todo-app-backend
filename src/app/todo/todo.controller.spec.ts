import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoEntity } from './entity/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ id: '1', task: 'Task-1', isDone: 0 }),
  new TodoEntity({ id: '2', task: 'Task-2', isDone: 0 }),
  new TodoEntity({ id: '3', task: 'Task-3', isDone: 0 }),
];

const newTodoEntity = new TodoEntity({
  task: 'Nova task',
  isDone: 0,
});

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(todoEntityList),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            findOne: jest.fn(),
            update: jest.fn(),
            deleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('should return a todo list entity successfully', async () => {
      // Ação
      const result = await todoController.index();

      //Assert
      expect(result).toEqual(todoEntityList);
      expect(typeof result).toEqual('object');
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      //Arranjo
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());

      //Assert
      expect(todoController.index()).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a new todo item successfuly', async () => {
      //Arranjo
      const body: CreateTodoDto = {
        task: 'Nova task',
        isDone: 0,
      };

      //Ação
      const result = await todoController.create(body);

      //Assert
      expect(result).toEqual(newTodoEntity);
    });
  });
});
