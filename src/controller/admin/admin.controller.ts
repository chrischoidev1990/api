import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FileMoveDto } from './dto/file-move.dto';
import { Admin } from '../../model/admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import { AdminId } from '../../auth/admin-id.decorator';
import { FileService } from '../../service/file.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/admin')
export class AdminController {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly fileService: FileService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  @ApiOperation({ summary: '프로필 이미지 업데이트' })
  @ApiResponse({ status: 201, description: '프로필 이미지 업데이트 성공' })
  @ApiResponse({ status: 400, description: '저장된 파일이 없습니다.' })
  async updateProfile(
    @Body() dto: FileMoveDto,
    @AdminId() adminId: number,
  ) {
    // 파일 이동 로직을 FileService로 위임
    const filename = path.basename(dto.tempKey);
    const destPath = path.join(dto.path, filename).replace(/\\/g, '/');
    try {
      await this.fileService.moveFile(dto.tempKey, destPath);
    } catch (e) {
      const message = typeof e === 'object' && e && 'message' in e ? (e as any).message : String(e);
      throw new BadRequestException(message);
    }
    // DB에 경로 저장
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });
    if (!admin) throw new BadRequestException('관리자를 찾을 수 없습니다.');
    const oldProfileImage = admin.profile_image_url;
    admin.profile_image_url = destPath;
    await this.adminRepository.save(admin);
    // 기존 프로필 이미지 삭제 (조건 없이)
    if (oldProfileImage) {
      await this.fileService.deleteFile(oldProfileImage);
    }
    return { path: destPath };
  }
}
