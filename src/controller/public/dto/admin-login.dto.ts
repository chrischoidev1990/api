import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@example.com', description: '이메일', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'adminpw123', description: '비밀번호(6자 이상)', required: true })
  @IsString()
  @MinLength(6)
  password: string;
}
