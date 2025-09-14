import { Controller, Post, Body, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AdminAuthService } from '../../service/admin.auth.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@ApiTags('Admin Auth')
@Controller('auth/admin')
export class AuthAdminController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '관리자 회원가입' })
  @ApiBody({ type: AdminSignupDto })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '유효성 검사 실패' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signup(@Body() dto: AdminSignupDto) {
    return this.adminAuthService.signup(dto.email, dto.password, dto.name, dto.phone);
  }

  @Post('login')
  @ApiOperation({ summary: '관리자 로그인' })
  @ApiBody({ type: AdminLoginDto })
  @ApiResponse({ status: 201, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: AdminLoginDto) {
    const admin = await this.adminAuthService.validateUser(dto.email, dto.password);
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    return this.adminAuthService.login(admin);
  }
}
