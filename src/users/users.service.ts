import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from '../dto/user.dto';

import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import { LoginDTO } from 'src/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    // take in the database table
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login(data: LoginDTO) {
    const { email, password } = data;

    // communicate with database
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user.confirmed) {
      throw new HttpException('User not confirmed', HttpStatus.BAD_REQUEST);
    }
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }

  async register(data: UserDTO) {
    const { email } = data;
    let user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    // creates an new instance
    user = await this.usersRepository.create(data);
    // saves it to the database
    await this.usersRepository.save(user);

    // email confirmation logic
    jwt.sign(
      {
        user,
      },
      'EMAIL_SECRET',
      {
        expiresIn: '1d',
      },
      (err, emailToken) => {
        const url = `http://localhost:3000/confirmation/${emailToken}`;
        const transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
          port: 587,
          auth: {
            user: 'team@hybridheroes.de',
            pass: 'HEROES...',
          },
        });
        transporter.sendMail({
          to: user.email,
          subject: 'Confirm email',
          html: `Please confirm your email: ${url}`,
        });
      },
    );

    return user.toResponseObject();
  }

  async getUsers(): Promise<any> {
    const users = await this.usersRepository.find();
    return users.map(user => user.toResponseObject());
  }

  async getUser(id: number): Promise<User[]> {
    return await this.usersRepository.find({
      select: ['id', 'email'],
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

  async confirmUser(token: string) {
    const {
      user: { id },
    } = jwt.verify(token, 'EMAIL_SECRET');
    return await this.usersRepository.update(id, { confirmed: true });
  }
}
