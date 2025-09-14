import { MemberService } from './../../service/www/member.service';
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
import * as path from 'path';
import { Member, MemberContext } from '../../auth/member-context.decorator';
import { FileService } from '../../service/common/file.service';
import { MemberContextDto } from './dto/member-context.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Member')
@ApiBearerAuth()
@Controller('www/member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly fileService: FileService,
  ) {}

  @Post('me')
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '멤버 컨텍스트 반환',
    type: MemberContextDto,
  })
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
    return await this.memberService.updateProfile(
      member.id,
      dto.tempKey,
      path.join(dto.path, path.basename(dto.tempKey)).replace(/\\/g, '/'),
    );
  }
}
