import { Injectable, BadRequestException } from '@nestjs/common';
import { Admin } from '../../model/admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../common/file.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly fileService: FileService,
  ) {}

  async updateProfile(
    adminId: number,
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
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });
    if (!admin) throw new BadRequestException('관리자를 찾을 수 없습니다.');
    const oldProfileImage = admin.profile_image_url;
    admin.profile_image_url = destPath;
    await this.adminRepository.save(admin);
    if (oldProfileImage) {
      await this.fileService.deleteFile(oldProfileImage);
    }
    return { path: destPath };
  }
}
