import { Injectable, Logger } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { v4 as uuidv4 } from 'uuid';
import { Trace } from '../common/decorators/trace.decorator';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private readonly logger = new Logger(TodoService.name);

  @Trace('TodoService.create')
  create(createTodoDto: CreateTodoDto): Todo {
    const id = uuidv4();
    const todo = new Todo({
      id,
      ...createTodoDto,
      completed: createTodoDto.completed ?? false,
    });

    this.todos.push(todo);
    return todo;
  }

  @Trace('TodoService.findAll')
  findAll(): Todo[] {
    return this.todos;
  }

  @Trace('TodoService.findOne')
  findOne(id: string): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  @Trace('TodoService.update')
  update(id: string, updateData: Partial<Todo>): Todo | undefined {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return undefined;
    }

    const updatedTodo = new Todo({
      ...this.todos[todoIndex],
      ...updateData,
      updatedAt: new Date(),
    });
    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  @Trace('TodoService.remove')
  remove(id: string): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return initialLength > this.todos.length;
  }
}
