import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ example: 'user@example.com', description: '이메일', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: '비밀번호(6자 이상)', required: true })
  @IsString()
  @MinLength(6)
  password: string;
}
