import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserDTO } from '../dto/user.dto';
import { LoginDTO } from 'src/dto/login.dto';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('login') // localhost:3000/login
  // Validate body against DTO
  @UsePipes(new ValidationPipe())
  // Access the body with decorator @Body()
  login(@Body() data: LoginDTO) {
    return this.usersService.login(data);
  }

  @Post('register') // localhost:3000/register
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    return this.usersService.register(data);
  }

  @Get('confirmation/:token') // localhost:3000/confirmation/eyddks...
  // Access params with decorator @Param()
  confirm(@Param('token') token) {
    return this.usersService.confirmUser(token);
  }

  @Get('users') // localhost:3000/users
  index(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get('users/:id') // localhost:3000/users/3
  async get(@Param('id') id) {
    return await this.usersService.getUser(id);
  }

  @Put('users/:id') // localhost:3000/users/3
  async update(@Param('id') id, @Body() user: User): Promise<any> {
    user.id = Number(id);
    return this.usersService.updateUser(user);
  }

  @Delete('users/:id') // localhost:3000/users/3
  async deleteUser(@Param('id') id): Promise<any> {
    return this.usersService.deleteUser(id);
  }
}
