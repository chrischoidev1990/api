import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FileMoveDto } from './dto/file-move.dto';
import { Admin as AdminEntity } from '../../model/admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import { AdminId } from '../../auth/admin-id.decorator';
import { FileService } from '../../service/common/file.service';
import { AdminContextDto } from './dto/admin-context.dto';
import {
  Admin as AdminDecorator,
  AdminContext,
} from '../../auth/admin-context.decorator';
import { AdminAuthService } from '../../service/auth/admin.auth.service';
import { AdminService } from '../../service/admin/admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/admin')
export class AdminController {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly fileService: FileService,
    private readonly adminService: AdminService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  @ApiOperation({ summary: '프로필 이미지 업데이트' })
  @ApiResponse({ status: 201, description: '프로필 이미지 업데이트 성공' })
  @ApiResponse({ status: 400, description: '저장된 파일이 없습니다.' })
  async updateProfile(@Body() dto: FileMoveDto, @AdminId() adminId: number) {
    return await this.adminService.updateProfile(
      adminId,
      dto.tempKey,
      path.join(dto.path, path.basename(dto.tempKey)).replace(/\\/g, '/'),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '관리자 컨텍스트 반환',
    type: AdminContextDto,
  })
  async getMe(@AdminDecorator() admin: AdminContext) {
    // AdminContext 전체 정보 반환
    return AdminContextDto.fromAdmin(admin);
  }
}
