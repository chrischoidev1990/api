import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // synchronize: true is great for development but should be turned off in production.
  // Use migrations instead for schema management in production.
  synchronize: true,
  logging: false,
  entities: [
    'src/entity/**/*.ts', // Path to your entities
  ],
  migrations: [],
  subscribers: [],
});