import { Session } from "@src/domain/interfaces";
import { SendLocationDTO } from "@src/domain/types";

export interface ILocationService {
  sendLocation(session: Session, locationData: SendLocationDTO): Promise<void>;
}
