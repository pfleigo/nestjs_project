import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { Posting } from './post.entity';
import { PostsService } from './post.service';
import { User } from 'src/users/user.decorator';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostDTO } from '../dto/post.dto';

@Controller('posts')
export class PostsController {
  SERVER_URL: string = 'http://localhost:3000/posts/';
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(new AuthGuard()) // checks the validity of the token
  createPost(@User('id') id, @Body() data: PostDTO) {
    return this.postsService.create(id, data);
  }

  @Get()
  @UseGuards(new AuthGuard())
  index(@User('id') id): Promise<Posting[]> {
    return this.postsService.getPosts(id);
  }

  @Get(':id')
  async get(@Param('id') id) {
    return await this.postsService.getPost(id);
  }

  @Put(':id')
  async update(@Param('id') id, @Body() post: Posting): Promise<any> {
    post.id = Number(id);
    return this.postsService.updatePost(post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id): Promise<any> {
    return this.postsService.deletePost(id);
  }

  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      // image = property name in the request body
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          return cb(null, file.originalname);
        },
      }),
    }),
  )
  uploadImage(@Param('id') postId, @UploadedFile() file) {
    this.postsService.addImage(
      Number(postId),
      `${this.SERVER_URL}${file.path}`,
    );
  }

  @Get('images/:fileId')
  @UseGuards(new AuthGuard())
  async serveImage(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'images' });
  }
}
