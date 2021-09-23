import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common'
import { TodosService } from './todos.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { SuccessInterceptor } from 'src/interceptor/success_response.interceptor'

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @UseInterceptors(new SuccessInterceptor(HttpStatus.CREATED))
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto)
  }

  @Get()
  @UseInterceptors(new SuccessInterceptor())
  findAll() {
    return this.todosService.findAll()
  }

  @Get(':id')
  @UseInterceptors(new SuccessInterceptor())
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id)
  }

  @Patch(':id')
  @UseInterceptors(new SuccessInterceptor())
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto)
  }

  @Delete(':id')
  @UseInterceptors(new SuccessInterceptor())
  remove(@Param('id') id: string) {
    return this.todosService.remove(id)
  }
}
