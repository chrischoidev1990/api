import { ApiProperty } from '@nestjs/swagger';
import { AdminContext } from '../../../auth/admin-context.decorator';

export class AdminContextDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  constructor(id: number, email: string, name: string, phone: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.phone = phone;
  }

  static fromAdmin(admin: AdminContext): AdminContextDto {
    return new AdminContextDto(admin.id, admin.email, admin.name, admin.phone);
  }
}
