// 에러 응답 DTO
import { ErrorType } from '../common/enum/ErrorType';

export class ErrorResponseDto {
  statusCode: number;
  message: string;
  error: ErrorType;
}
