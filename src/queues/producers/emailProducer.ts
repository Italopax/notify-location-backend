import { inject, injectable } from "inversify";
import { IEmailPublisher } from "./interfaces/emailProducer.interface";
import { EmailData } from "@src/domain/interfaces";
import { Queues } from "@src/domain/enums";
import { TYPES } from "@src/utils/inversify/inversify-types";
import { IQueueServer } from "../server";

@injectable()
export class EmailPublisher implements IEmailPublisher {
  constructor(
    @inject(TYPES.queue.QUEUE_SERVER) private readonly queueServer: IQueueServer,
  ) {}

  public async publishEmailTask({ text, title, destinyEmail }: EmailData): Promise<void> {
    try {
      const { channel } = await this.queueServer.connect();
      const queueName = Queues.EMAIL_NOTIFICATIONS;

      await channel.assertQueue(queueName, { durable: true });

      const queueItemData = JSON.stringify({ text, title, destinyEmail });

      channel.sendToQueue(queueName, Buffer.from(queueItemData), { persistent: true });
    } catch (error) {
      console.error(`ERROR TO PUBLISH ITEM: ${error.message}`, { text, title, destinyEmail });
    }
  }
}
