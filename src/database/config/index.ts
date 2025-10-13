import { getEnv } from '@src/utils/constants';
import { join } from 'node:path';
import { DataSource } from 'typeorm';

export class DatabaseProvider {
  private static DataSource: DataSource;

  constructor() {}

  static getDataSource(): DataSource {
    const databaseEnvs = getEnv().database;

    if (this.DataSource) return this.DataSource;
    
    this.DataSource = new DataSource({
      type: 'postgres',
      host: databaseEnvs.host,
      port: databaseEnvs.port,
      username: databaseEnvs.username,
      database: databaseEnvs.database,
      password: databaseEnvs.password,
      migrationsRun: true,
      migrationsTransactionMode: 'each',
      migrations: [`${join(__dirname, '../migrations/*.{js,ts}')}`],
      entities: [`${join(__dirname, '../entities/*.entity.{js,ts}')}`],
      synchronize: false,
      logging: true,
    })

    return this.DataSource;
  } 
}