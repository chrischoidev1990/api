import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MemberAuthService } from '../../service/auth/member.auth.service';
import { MemberSignupDto } from './dto/member-signup.dto';
import { MemberLoginDto } from './dto/member-login.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@ApiTags('Member Auth')
@Controller('auth/member')
export class AuthMemberController {
  constructor(private readonly memberAuthService: MemberAuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '멤버 회원가입' })
  @ApiBody({ type: MemberSignupDto })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '유효성 검사 실패' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signup(@Body() dto: MemberSignupDto) {
    return this.memberAuthService.signup(
      dto.email,
      dto.password,
      dto.name,
      dto.phone,
    );
  }

  @Post('login')
  @ApiOperation({ summary: '멤버 로그인' })
  @ApiBody({ type: MemberLoginDto })
  @ApiResponse({ status: 201, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: MemberLoginDto) {
    const member = await this.memberAuthService.validateUser(
      dto.email,
      dto.password,
    );
    if (!member) throw new UnauthorizedException('Invalid credentials');
    return this.memberAuthService.login(member);
  }
}
