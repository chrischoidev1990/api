import { Injectable } from '@nestjs/common';
import { Member } from '../model/member.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MemberAuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, password: string, name: string, phone: string): Promise<Member> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const member = this.memberRepository.create({ email, password: hashedPassword, name, phone });
    return this.memberRepository.save(member);
  }

  async validateUser(email: string, password: string): Promise<Member | null> {
    const member = await this.memberRepository.findOne({ where: { email } });
    if (!member) return null;
    const isMatch = await bcrypt.compare(password, member.password!);
    return isMatch ? member : null;
  }

  async login(member: Member): Promise<{ access_token: string }> {
    const payload = {
      id: member.id,
      email: member.email,
      name: member.name,
      phone: member.phone,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

    async updateProfileImage(memberId: number, imageUrl: string): Promise<Member> {
      const member = await this.memberRepository.findOne({ where: { id: memberId } });
      if (!member) throw new Error('Member not found');
      member.profile_image_url = imageUrl;
      return this.memberRepository.save(member);
    }
}
