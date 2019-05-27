import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Posting } from 'src/post/post.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ length: 25 })
  name: string;

  @ApiModelProperty()
  @Column({ default: '' })
  avatar: string;

  @ApiModelProperty()
  @Column({ default: '' })
  email: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ApiModelProperty()
  @OneToMany(type => Posting, post => post.author)
  posts: Posting[];

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
