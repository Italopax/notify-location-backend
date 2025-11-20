import { getEnv } from '@src/utils/constants';
import { inject, injectable } from "inversify";
import { IEmailConsumer } from './interfaces/emailConsumer.interface';
import { EmailData } from '@src/domain/interfaces';
import { TYPES } from '@src/utils/inversify/inversify-types';
import { EmailAdaptor } from '@src/adapters/email.adaptor';
import { Channel, ConsumeMessage } from 'amqplib';
import { Queues } from '@src/domain/enums';
import { IQueueServer } from '../server';

@injectable()
export class EmailConsumer implements IEmailConsumer {
  private channel: Channel;

  constructor(
    @inject(TYPES.adapters.EMAIL_ADAPTER) private readonly emailAdapter: EmailAdaptor,
    @inject(TYPES.queue.QUEUE_SERVER) private readonly queueServer: IQueueServer,
  ) {
    this.consumerAction = this.consumerAction.bind(this);
  }

  public async start(): Promise<void> {
    const { channel } = await this.queueServer.connect();
    this.channel = channel;

    const queueName = Queues.EMAIL_NOTIFICATIONS;

    await channel.assertQueue(queueName, { durable: true });

    await this.channel.prefetch(getEnv().queue.consumersPrefetch);
    await this.channel.consume(queueName, this.consumerAction, { noAck: false });
  }

  private async consumerAction(message: ConsumeMessage) {
    const stringMessage = message.content.toString();
    const emailData: EmailData = JSON.parse(stringMessage);

    await this.sendEmail(emailData);
    this.channel.ack(message);
  }

  private async sendEmail(emailData: EmailData): Promise<void> {
    await this.emailAdapter.sendEmail(emailData)
      .catch((error: Error) => {
        console.error(`ERROR TO SEND EMAIL BY CONSUMER: ${error.message}`, emailData);
      });
  }
}
