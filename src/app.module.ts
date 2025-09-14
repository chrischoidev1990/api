import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './controller/app.controller';
import { AuthAdminController } from './controller/public/auth.admin.controller';
import { AuthMemberController } from './controller/public/auth.member.controller';
import { CommonController } from './controller/public/common.controller';
import { AdminController } from './controller/admin/admin.controller';
import { MemberController } from './controller/www/member.controller';
import { AdminAuthService } from './service/auth/admin.auth.service';
import { MemberAuthService } from './service/auth/member.auth.service';
import { FileService } from './service/common/file.service';
import { AdminService } from './service/admin/admin.service';
import { MemberService } from './service/www/member.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './model/member.entity';
import { Admin } from './model/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'app',
      entities: [Member, Admin],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Member, Admin]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AppController,
    AuthAdminController,
    AuthMemberController,
    CommonController,
    AdminController,
    MemberController,
  ],
  providers: [
  AppService,
  AdminAuthService,
  MemberAuthService,
  FileService,
  JwtStrategy,
  AdminService,
  MemberService,
  ],
})
export class AppModule {}
