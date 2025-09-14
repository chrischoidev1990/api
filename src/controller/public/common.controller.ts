import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileService } from '../../service/common/file.service';
import { PresignedUrlDto } from './dto/presigned-url.dto';

@ApiTags('Common')
@Controller('common')
export class CommonController {
  constructor(private readonly fileService: FileService) {}
  @Post('upload')
  @ApiOperation({ summary: '파일 업로드 (temp 폴더)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: '업로드 성공, 경로와 파일명 반환' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.fileService.uploadFile(file);
    return result;
  }

  @Post('presigned-url')
  @ApiOperation({ summary: 'S3 presigned URL 발급' })
  @ApiResponse({ status: 201, description: 'Presigned URL 반환' })
  async getPresignedUrl(@Body() body: PresignedUrlDto) {
    const { key, expiresIn = 60 } = body;
    // Only encode key for S3, not the whole URL
    const url = await this.fileService.getPresignedUrl(key, expiresIn);
    return { key, url };
  }
}
