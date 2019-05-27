import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Posting } from './post.entity';
import { User } from 'src/users/user.entity';
import { PostDTO } from './post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posting)
    private postsRepository: Repository<Posting>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: string, data: PostDTO): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const post = await this.postsRepository.create({ ...data, author: user });
    await this.postsRepository.save(post);

    return { ...post, author: post.author };
  }

  async getPosts(userId): Promise<any> {
    const posts = await this.postsRepository.find({ relations: ['author'] });
    return posts.filter(post => post.public || post.author.id === userId);
  }

  async getPost(id: number): Promise<Posting[]> {
    return await this.postsRepository.find({
      select: ['title', 'description', 'image'],
      where: [{ id }],
    });
  }

  async updatePost(post: Posting): Promise<UpdateResult> {
    return await this.postsRepository.update(post.id, post);
  }

  async deletePost(post: Posting): Promise<DeleteResult> {
    return await this.postsRepository.delete(post);
  }

  async addImage(postId: number, imageUrl: string) {
    console.log(postId, imageUrl);
    return await this.postsRepository.update(postId, { image: imageUrl });
  }
}
