import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { EMPTY_STRING } from '../common/constant';
import { HttpStatus } from '../common/enum/HttpStatus';
import { isEmpty } from '../util';
import { ErrorResponseDto } from './ErrorResponseDto';
import { ErrorType } from '../common/enum/ErrorType';

// NestJS Logger 인스턴스 생성
const logger = new Logger();

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  // HttpAdapterHost를 주입받아 HTTP 응답을 직접 제어
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // 예외 발생 시 호출되는 메서드
  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    // 예외가 HttpException이면 상태코드 반환, 아니면 500 반환
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // 예외가 HttpException이면 getResponse() 사용, 아니면 커스텀 에러 객체 생성
    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : ({
            statusCode: httpStatus,
            message: exception.message,
            error: ErrorType.UNKNOWN,
          } as ErrorResponseDto);

    // 요청 정보와 body를 마스킹하여 로그 컨텍스트 생성
    const context = `${request.method}:${request.url}${
      isEmpty(request.body)
        ? EMPTY_STRING
        : ` - body:${JSON.stringify(maskBody(request.body))}`
    }`;

    // 에러 로그 남기기
    logger.error(responseBody, exception.stack, context);

    // 클라이언트에 응답 반환
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}

// 요청 body에서 password 필드 마스킹 함수
function maskBody(body: any): any {
  const maskedBody = { ...body };

  if (maskedBody.password) {
    maskedBody.password = '******';
  }

  return maskedBody;
}