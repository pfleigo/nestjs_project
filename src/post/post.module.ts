import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posting } from './post.entity';
import { PostsService } from './post.service';
import { PostsController } from './post.controller';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posting, User])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostModule {}
