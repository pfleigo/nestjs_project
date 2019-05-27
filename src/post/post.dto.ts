import { IsString, IsBoolean } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class PostDTO {
  @ApiModelProperty()
  @IsString()
  readonly title: string;

  @ApiModelProperty()
  @IsString()
  readonly description: string;

  @ApiModelProperty()
  @IsBoolean()
  readonly public: boolean;
}
