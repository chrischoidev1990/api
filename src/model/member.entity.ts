import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('members')
export class Member extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  profile_image_url: string | null = null;
}