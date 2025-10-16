import 'reflect-metadata';
import '@controllers/index';

import helmet from "helmet";
import cors from "cors";
import express from 'express';
import { getEnv } from "./utils/constants";
import { container } from "./utils/inversify/inversify.config";
import { InversifyExpressServer } from "inversify-express-utils";
import { errorHandler } from './utils/errors';
import httpStatus from "http-status";

export class Server {
  static async initServer() {
    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
      app.use(express.json());
      app.use(helmet());
      app.use(cors({ origin: '*' }));
    });

    server.setErrorConfig((app): void => {
      app.use(errorHandler);
  
      app.use((req, res, next): void => {
        res.status(httpStatus.NOT_FOUND).json({
          errorMessage: 'Route not found',
        });
      });
    });


    const app = server.build()

    const port = getEnv().customAppPort;
    app.listen(port, () => {
      console.log(`APP INITIALIZED IN PORT ${port}`);
    })
  };
}
