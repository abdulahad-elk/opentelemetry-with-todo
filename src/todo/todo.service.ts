import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { v4 as uuidv4 } from 'uuid';
import { TraceMethod } from '../common/decorators/trace.decorator';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private readonly logger = new Logger(TodoService.name);

  @TraceMethod('TodoService.create')
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

  @TraceMethod('TodoService.findAll')
  findAll(): Todo[] {
    return this.todos;
  }

  @TraceMethod('TodoService.findOne')
  findOne(id: string): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  @TraceMethod('TodoService.update')
  update(id: string, updateData: Partial<Todo>): Todo {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    const updatedTodo = new Todo({
      ...this.todos[todoIndex],
      ...updateData,
      updatedAt: new Date(),
    });
    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  @TraceMethod('TodoService.remove')
  remove(id: string): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((todo) => todo.id !== id);
    if (initialLength === this.todos.length) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return true;
  }
}
