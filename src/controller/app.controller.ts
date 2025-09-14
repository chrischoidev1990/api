import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from '../app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '헬스 체크 및 기본 인사' })
  @ApiResponse({ status: 200, description: '서버 정상 동작' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('favicon.ico')
  @ApiOperation({ summary: 'favicon.ico 요청 처리' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @HttpCode(HttpStatus.NO_CONTENT)
  getFavicon() {
    // 브라우저의 favicon.ico 요청에 대한 404 오류를 방지하기 위해 204 No Content를 반환합니다.
  }
}
