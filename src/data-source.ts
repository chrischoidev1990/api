import { DataSource } from 'typeorm';
import { Member } from './model/member.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  entities: [Member],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
});
