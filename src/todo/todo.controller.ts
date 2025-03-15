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
import { Trace } from '../common/decorators/trace.decorator';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @Trace('TodoController.create')
  create(@Body() createTodoDto: CreateTodoDto): Todo {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  @Trace('TodoController.findAll')
  findAll(): Todo[] {
    return this.todoService.findAll();
  }

  @Get(':id')
  @Trace('TodoController.findOne')
  findOne(@Param('id') id: string): Todo {
    const todo = this.todoService.findOne(id);
    if (!todo) {
      console.log('Todo with ID ${id} not found');
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  @Put(':id')
  @Trace('TodoController.update')
  update(@Param('id') id: string, @Body() updateData: Partial<Todo>): Todo {
    const todo = this.todoService.update(id, updateData);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  @Delete(':id')
  @Trace('TodoController.remove')
  remove(@Param('id') id: string): { success: boolean } {
    const result = this.todoService.remove(id);
    if (!result) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return { success: true };
  }
}
