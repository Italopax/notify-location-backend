import { EmailData } from "@src/domain/interfaces";

export interface IEmailPublisher {
  publishEmailTask(emailData: EmailData): Promise<void>;
}
