import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminSignupDto {
  @ApiProperty({ example: 'admin@example.com', description: '이메일', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'adminpw123', description: '비밀번호(6자 이상)', required: true })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '관리자', description: '이름', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '01087654321', description: '휴대폰 번호', required: true })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
