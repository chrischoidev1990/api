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
import { MemberAuthService } from '../../service/member.auth.service';
// import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import { Member, MemberContext } from '../../auth/member-context.decorator';
import { FileService } from '../../service/file.service';
import { MemberContextDto } from './dto/member-context.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Member')
@ApiBearerAuth()
@Controller('www/member')
export class MemberController {
  constructor(
    private readonly memberAuthService: MemberAuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('me')
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({ status: 200, description: '멤버 컨텍스트 반환', type: MemberContextDto })
  async getMe(@Member() member: MemberContext) {
    return new MemberContextDto(member);
  }

  @Post('update-profile')
  @ApiOperation({ summary: '프로필 이미지 업데이트' })
  @ApiResponse({ status: 201, description: '프로필 이미지 업데이트 성공' })
  @ApiResponse({ status: 400, description: '저장된 파일이 없습니다.' })
  async updateProfile(
    @Body() dto: FileMoveDto,
    @Member() member: MemberContext,
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
    // DB에 경로 저장 (admin과 동일하게 직접 엔티티 수정)
    const memberEntity = await this.memberAuthService['memberRepository'].findOne({ where: { id: member.id } });
    if (!memberEntity) throw new BadRequestException('회원을 찾을 수 없습니다.');
    const oldProfileImage = memberEntity.profile_image_url;
    memberEntity.profile_image_url = destPath;
    await this.memberAuthService['memberRepository'].save(memberEntity);
    // 기존 프로필 이미지 삭제 (조건 없이)
    if (oldProfileImage) {
      await this.fileService.deleteFile(oldProfileImage);
    }
    return { path: destPath };
  }
}
