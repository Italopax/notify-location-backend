import 'dotenv/config';
import { initializeEnvs } from '@utils/constants';
import { DataSource } from 'typeorm';

(async () => {
  console.log('INITIALIZING ENVS');
  initializeEnvs(process.env);
  console.log('INITIALIZED ENVS');

  const { DatabaseProvider } = require('./database/config/index');
  const AppDataSource: DataSource = DatabaseProvider.getDataSource();
  await AppDataSource.initialize();

  const { Server } = require('./server');
  Server.initServer();
})().catch((error: Error) => {
  console.error(error);
});