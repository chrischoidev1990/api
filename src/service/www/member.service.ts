import { Injectable, BadRequestException } from '@nestjs/common';
import { Member } from '../../model/member.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../common/file.service';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly fileService: FileService,
  ) {}

  async updateProfile(
    memberId: number,
    tempKey: string,
    destPath: string,
  ): Promise<{ path: string }> {
    try {
      await this.fileService.moveFile(tempKey, destPath);
    } catch (e) {
      const message =
        typeof e === 'object' && e && 'message' in e
          ? (e as any).message
          : String(e);
      throw new BadRequestException(message);
    }
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
    });
    if (!member) throw new BadRequestException('회원을 찾을 수 없습니다.');
    const oldProfileImage = member.profile_image_url;
    member.profile_image_url = destPath;
    await this.memberRepository.save(member);
    if (oldProfileImage) {
      await this.fileService.deleteFile(oldProfileImage);
    }
    return { path: destPath };
  }
}
