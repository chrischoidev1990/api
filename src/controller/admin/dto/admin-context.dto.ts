import { ApiProperty } from '@nestjs/swagger';

export class AdminContextDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  constructor(data: { id: number; email: string; name: string; phone: string }) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.phone = data.phone;
  }
}
