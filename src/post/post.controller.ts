import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { Posting } from './post.entity';
import { PostsService } from './post.service';
import { User } from 'src/users/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private service: PostsService) {}

  @Post()
  @UseGuards(new AuthGuard())
  createPostfix(@User('id') id, @Body() data) {
    return this.service.create(id, data);
  }

  @Get()
  @UseGuards(new AuthGuard())
  index(): Promise<Posting[]> {
    return this.service.getPosts();
  }

  @Get(':id')
  async get(@Param('id') id) {
    return await this.service.getPost(id);
  }

  @Put(':id')
  async update(@Param('id') id, @Body() post: Posting): Promise<any> {
    post.id = Number(id);
    console.log('Update #' + post.id);
    return this.service.updatePost(post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id): Promise<any> {
    return this.service.deletePost(id);
  }
}
