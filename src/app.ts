import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from '@database/config';

(async () => {
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