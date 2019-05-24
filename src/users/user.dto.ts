import { IsNotEmpty } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  password: string;
}
