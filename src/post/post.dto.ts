import { IsString } from 'class-validator';

export class PostDTO {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;
}
