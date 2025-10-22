import { Session } from "@src/domain/interfaces";
import { TUserCreateInput, TUserModel } from "@src/domain/models/user.model";

export interface IUserService {
  createUser (userData: TUserCreateInput): Promise<Partial<TUserModel>>;
  getMe ({ userId }: Session): Promise<Partial<TUserModel>>;
  getMe ({ userId }: Session): Promise<Partial<TUserModel>>;
  validateEmail (session: Session, verificationCode: string): Promise<void>;
  resendVerificationCode (session: Session): Promise<void>;
}