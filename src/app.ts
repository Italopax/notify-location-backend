import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { CreateAppDataSource } from '@database/config';
import { getEnv, initializeEnvs } from '@utils/constants';

(async () => {
  console.log('INITIALIZING ENVS');
  initializeEnvs(process.env);
  console.log('INITIALIZED ENVS');

  console.log('INITIALIZING DATABASE');
  const AppDataSource = CreateAppDataSource(getEnv().database);
  await AppDataSource.initialize();
  console.log('INITIALIZED DATABASE');

  const app = express();

  app.get('/', (req, res) =>  {
    res.status(200).send({});
  });

  app.listen('3000', () => {
    console.log('listen');
  });
})().catch((error: Error) => {
  console.error(error);
});