import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  @ApiProperty({ example: 'example@mail.com', description: 'user email' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'mYp4s$worD', description: 'user pawssword' })
  password: string;
}
