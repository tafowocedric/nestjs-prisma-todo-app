import { Injectable } from '@nestjs/common'
import { EntityNotFoundError } from 'src/interceptor/error_response.interceptor'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { TodoEntity } from './entities/todo.entity'

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return this.prisma.todo.create({ data: createTodoDto })
  }

  findAll(): Promise<TodoEntity[]> {
    return this.prisma.todo.findMany()
  }

  async findOne(id: string) {
    const todo = await this.prisma.todo.findUnique({ where: { id } })

    if (!todo) throw new EntityNotFoundError(`No record found with id: ${id}`)
    return todo
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.prisma.todo.findUnique({ where: { id } })

    if (!todo) throw new EntityNotFoundError(`No record found with id: ${id}`)

    return this.prisma.todo.update({
      where: { id: id },
      data: updateTodoDto,
    })
  }

  async remove(id: string): Promise<any> {
    const todo = await this.prisma.todo.findUnique({ where: { id } })

    if (!todo) throw new EntityNotFoundError(`No record found with id: ${id}`)
    await this.prisma.todo.delete({ where: { id } })

    return []
  }
}
