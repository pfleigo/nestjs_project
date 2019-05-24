import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login(data: UserDTO) {
    const { name, password } = data;
    const user = await this.usersRepository.findOne({ where: { name } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }

  async register(data: UserDTO) {
    const { name } = data;
    let user = await this.usersRepository.findOne({ where: { name } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = await this.usersRepository.create(data);
    await this.usersRepository.save(user);

    return user.toResponseObject();
  }

  async getUsers(): Promise<any> {
    const users = await this.usersRepository.find();
    return users.map(user => user.toResponseObject());
  }

  async getUser(id: number): Promise<User[]> {
    return await this.usersRepository.find({
      select: ['name', 'id', 'email'],
      where: [{ id }],
    });
  }

  async updateUser(user: User): Promise<UpdateResult> {
    return await this.usersRepository.update(user.id, user);
  }

  async deleteUser(user: User): Promise<DeleteResult> {
    return await this.usersRepository.delete(user);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
}
