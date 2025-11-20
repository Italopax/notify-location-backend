import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./inversify-types";

import { IUserRepository } from "@src/database/repositories/interface/user.interface";
import { UserRepository } from "@src/database/repositories";

import { IUserService } from "@src/services/interface/user.interface";
import { UserService } from "@src/services";
import { DataSource } from "typeorm";
import { EncryptionAdapter } from "@src/adapters/encryption.adapter";
import { JwtAdapter } from "@src/adapters/jwt.adapter";
import { IAuthService } from "@src/services/interface/auth.interface";
import { AuthService } from "@src/services/auth.service";
import { EmailAdaptor } from "@src/adapters/email.adaptor";
import { IQueueServer, QueueServer } from "@src/queues/server";
import { EmailPublisher } from "@src/queues/producers/emailProducer";
import { EmailConsumer } from "@src/queues/consumers/emailConsumer";
import { IEmailConsumer } from "@src/queues/consumers/interfaces/emailConsumer.interface";
import { IEmailPublisher } from "@src/queues/producers/interfaces/emailProducer.interface";

const container = new Container();

container.bind<IUserRepository>(TYPES.repositories.USER_REPOSITORY).to(UserRepository).inSingletonScope();
container.bind<IUserService>(TYPES.services.USER_SERVICE).to(UserService).inSingletonScope();

const { DatabaseProvider } = require('../../database/config/index');
container.bind<DataSource>(TYPES.DATABASE_SOURCE).toConstantValue(DatabaseProvider.getDataSource());

container.bind<IAuthService>(TYPES.services.AUTH_SERVICE).to(AuthService).inSingletonScope();

container.bind<EncryptionAdapter>(TYPES.adapters.ENCRYPTION_ADAPTER).to(EncryptionAdapter).inSingletonScope();
container.bind<JwtAdapter>(TYPES.adapters.JWT_ADAPTER).to(JwtAdapter).inSingletonScope();
container.bind<EmailAdaptor>(TYPES.adapters.EMAIL_ADAPTER).to(EmailAdaptor).inSingletonScope();

container.bind<IQueueServer>(TYPES.queue.QUEUE_SERVER).to(QueueServer).inSingletonScope();

container.bind<IEmailPublisher>(TYPES.queue.producers.EMAIL_PUBLISHER).to(EmailPublisher).inSingletonScope();
container.bind<IEmailConsumer>(TYPES.queue.consumers.EMAIL_CONSUMER).to(EmailConsumer).inSingletonScope();

export { container };