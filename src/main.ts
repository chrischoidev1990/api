import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationError, ValidationPipe, BadRequestException} from '@nestjs/common';
import { AllExceptionFilter } from './error/AllExceptionFilter';



const DEFAULT_PORT = 3000;
const PORT = process.env.PORT ?? DEFAULT_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for all origins
  app.enableCors();
  // httpAdapterHost 주입
  const httpAdapterHost = app.get(HttpAdapterHost);
  // useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
  app.useGlobalFilters(new AllExceptionFilter(httpAdapterHost));
  // useGlobalPipes with ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 프로퍼티 제거
      transformOptions: {
        enableImplicitConversion: true, // 암시적 타입 변환 허용
      },
      transform: true, // 요청 데이터를 DTO 타입으로 변환
      exceptionFactory: (errors: ValidationError[]) => {
         if (errors && errors.length > 0) {
          const constraints = errors.reduce((acc, error) => {
            return { ...acc, ...error.constraints };
          }, {});

          return new BadRequestException(
            null,
            Object.values(constraints).join(', ')
            );
        } else {
          return new BadRequestException(
            null,
            'Parameter validation error occured',
          );
        }
      }
    }),
  );

    // Swagger 설정 추가
    const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
    const config = new DocumentBuilder()
      .setTitle('API Docs')
      .setDescription('NestJS API Swagger')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);


  await app.listen(PORT);
}
bootstrap();
