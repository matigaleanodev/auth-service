import { IsString } from 'class-validator';
import { LoginUserDTO } from './login-user.dto';

export class CreateUserDTO extends LoginUserDTO {
  @IsString()
  name: string;
}
