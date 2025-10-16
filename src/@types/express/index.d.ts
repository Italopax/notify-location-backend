import { Session } from "@src/domain/interfaces";

declare global {
  namespace Express {
    interface Request {
      session: Session;
    }
  }
}
