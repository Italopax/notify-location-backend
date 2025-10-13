import 'reflect-metadata';
import '@controllers/index';

import helmet from "helmet";
import cors from "cors";
import express from 'express';
import { getEnv } from "./utils/constants";
import { container } from "./utils/inversify/inversify.config";
import { InversifyExpressServer } from "inversify-express-utils";

export class Server {
  static async initServer() {
    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
      app.use(express.json());
      app.use(helmet());
      app.use(cors({ origin: '*' }));
    });

    const app = server.build()

    const port = getEnv().customAppPort;
    app.listen(port, () => {
      console.log(`APP INITIALIZED IN PORT ${port}`);
    })
  };
}
