import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileMoveDto {
  @ApiProperty({ description: '임시 파일 키', example: 'temp/12345_profile.png' })
  @IsString()
  tempKey: string;

  @ApiProperty({ description: '저장 경로', example: 'profile/12345.png' })
  @IsString()
  path: string;
}
