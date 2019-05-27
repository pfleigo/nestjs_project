import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class Posting {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column()
  title: string;

  @ApiModelProperty()
  @Column()
  description: string;

  @ApiModelProperty()
  @Column({ default: true })
  public: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ApiModelProperty()
  @Column({ default: '' })
  image: string;

  @ApiModelProperty()
  @ManyToOne(type => User, author => author.posts)
  author: User;
}
