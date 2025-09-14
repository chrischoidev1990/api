import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PresignedUrlDto {
  @ApiProperty({ description: 'S3 파일 키', example: 'test.txt' })
  @IsString()
  key: string;

  @ApiPropertyOptional({ description: '만료 시간(초)', example: 60 })
  @IsOptional()
  @IsNumber()
  expiresIn?: number; // 초 단위, 기본 60
}
