import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserDTO } from '../dto/user.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller()
export class UsersController {
  constructor(private service: UsersService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDTO) {
    return this.service.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    return this.service.register(data);
  }

  @Get('confirmation/:token')
  confirm(@Param('token') token) {
    return this.service.confirmUser(token);
  }

  @Get('users')
  index(): Promise<User[]> {
    return this.service.getUsers();
  }

  @Get('users/:id')
  async get(@Param('id') id) {
    return await this.service.getUser(id);
  }

  @Put('users/:id')
  async update(@Param('id') id, @Body() user: User): Promise<any> {
    user.id = Number(id);
    console.log('Update #' + user.id);
    return this.service.updateUser(user);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id): Promise<any> {
    return this.service.deleteUser(id);
  }
}
