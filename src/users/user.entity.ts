import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25 })
  name: string;

  @Column({ default: '' })
  avatar: string;

  @Column({ default: '' })
  email: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  @Column()
  password: string;

  toResponseObject() {
    const { id, name, avatar, email, token } = this;
    const responseObject = { id, name, avatar, email, token };
    return responseObject;
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, name } = this;
    return jwt.sign(
      {
        id,
        name,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
  }
}
