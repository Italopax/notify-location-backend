import 'reflect-metadata';
import "dotenv/config";
import express from 'express';
import { AppDataSource } from '@database/config';
import { initializeEnvs } from '@utils/constants';

(async () => {
  initializeEnvs(process.env);

  const app = express();

  console.log('INITIALIZING DATABASE');
  await AppDataSource.initialize();
  console.log('INITIALIZED DATABASE');

  app.get('/', (req, res) =>  {
    res.status(200).send({});
  });

  app.listen('3000', () => {
    console.log('listen');
  });
})().catch((error: Error) => {
  console.error(error);
});