import { getEnv } from '@src/utils/constants';
import amqp, { Channel, ChannelModel } from 'amqplib';
import { injectable } from "inversify";

import { QueueConnectReturn } from '@src/domain/interfaces';

export interface IQueueServer {
  connect(): Promise<QueueConnectReturn>;
}

@injectable()
export class QueueServer implements IQueueServer {
  private channel: Channel;
  private connection: ChannelModel;

  constructor() {}

  public async connect(): Promise<QueueConnectReturn> {
    if (!this.connection) this.connection = await amqp.connect(getEnv().queue.baseUrl);

    if (!this.channel) this.channel = await this.connection.createChannel();

    return {
      connection: this.connection,
      channel: this.channel,
    };
  }
}
