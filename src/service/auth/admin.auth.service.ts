import { Injectable, BadRequestException } from '@nestjs/common';
import { Admin } from '../../model/admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(
    email: string,
    password: string,
    name: string,
    phone: string,
  ): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = this.adminRepository.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });
    return this.adminRepository.save(admin);
  }

  async validateUser(email: string, password: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) return null;
    const isMatch = await bcrypt.compare(password, admin.password!);
    return isMatch ? admin : null;
  }

  async login(admin: Admin): Promise<{ access_token: string }> {
    const payload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      phone: admin.phone,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
