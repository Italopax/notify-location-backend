import { Constants, getEnv } from '@src/utils/constants';
import { join } from 'node:path';
import { DataSource } from 'typeorm';

export const CreateAppDataSource = (envs?: Constants['database']) => {
  if (!envs) envs = getEnv().database; 

  return new DataSource({
    type: 'postgres',
    host: envs.host,
    port: envs.port,
    username: envs.username,
    database: envs.database,
    password: envs.password,
    migrationsRun: true,
    migrationsTransactionMode: 'each',
    migrations: [`${join(__dirname, '../migrations/*.{js,ts}')}`],
    entities: [`${join(__dirname, '../entities/*.entity.{js,ts}')}`],
    synchronize: false,
    logging: true,
  })
};
