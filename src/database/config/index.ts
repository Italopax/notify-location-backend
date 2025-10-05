import { join } from 'node:path';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  database: 'notify-location',
  password: 'password',
  migrationsRun: true,
  migrationsTransactionMode: 'each',
  migrations: [`${join(__dirname, '../migrations/*.{js,ts}')}`],
  entities: [`${join(__dirname, '../entities/*.entity.{js,ts}')}`],
  synchronize: false,
  logging: true,
});
