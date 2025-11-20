import { EmailData, Session } from "@src/domain/interfaces";
import { SendLocationDTO } from "@src/domain/types";
import { ILocationService } from "./interface/location.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@src/utils/inversify/inversify-types";
import { IUserRepository } from "@src/database/repositories/interface/user.interface";
import { BadRequest, Errors } from "@src/utils/errors";
import { IEmailPublisher } from "@src/queues/producers/interfaces/emailProducer.interface";
import { DateUtilHelper } from "@src/utils/date";

@injectable()
export class LocationService implements ILocationService {
  constructor(
    @inject(TYPES.repositories.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @inject(TYPES.queue.producers.EMAIL_PUBLISHER) private readonly emailPublisher: IEmailPublisher,
  ) {}

  public async sendLocation(session: Session, { latitude, longitude }: SendLocationDTO): Promise<void> {
    const { userId } = session;

    const dontHasRequiredData = !latitude || !longitude;
    if (dontHasRequiredData) throw new BadRequest(Errors.INVALID_PARAMS);

    const user = await this.userRepository.selectOne(
      { id: userId },
      { name: true, email: true }
    );

    if (!user) throw new BadRequest(Errors.USER_NOT_FOUND);

    const googleMapsUrl = this.generateGoogleMapsUrl({ latitude, longitude });

    await this.sendNotifications(user.email, user.name, googleMapsUrl);
  }

  private generateGoogleMapsUrl({ latitude, longitude }: SendLocationDTO): string {
    return `https://maps.google.com/?q=${latitude},${longitude}`
  }

  private async sendNotifications(
    destinyEmail: string,
    username: string,
    linkLocation: string
  ): Promise<void> {
    try {
      const now = DateUtilHelper.getNow();

      await this.emailPublisher.publishEmailTask({
        destinyEmail,
        title: `Localização do usuário: ${username}`,
        text: `Link da localização atual (${now}) do usuário: ${username}: ${linkLocation}`,
      });
    } catch (error) {
      throw new BadRequest(Errors.EMAIL_SENDING_ERROR);
    }
  }
}