import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Todo {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll(): Todo[] {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Todo {
    const todo = this.todoService.findOne(id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Todo>): Todo {
    const todo = this.todoService.update(id, updateData);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  @Delete(':id')
  remove(@Param('id') id: string): { success: boolean } {
    const deleted = this.todoService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return { success: true };
  }
}
