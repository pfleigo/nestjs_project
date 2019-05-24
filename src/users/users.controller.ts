import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  index(): Promise<User[]> {
    return this.service.getUsers();
  }

  @Get(':id')
  async get(@Param('id') id) {
    return await this.service.getUser(id);
  }

  @Post()
  async create(@Body() user: User): Promise<any> {
    return this.service.createUser(user);
  }

  @Put(':id')
  async update(@Param('id') id, @Body() user: User): Promise<any> {
    user.id = Number(id);
    console.log('Update #' + user.id);
    return this.service.updateUser(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id): Promise<any> {
    return this.service.deleteUser(id);
  }
}
