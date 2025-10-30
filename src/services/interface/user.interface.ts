import { Session } from "@src/domain/interfaces";
import { TUserCreateInput, TUserModel, TUserUpdateInput } from "@src/domain/models/user.model";
import { ChangePasswordDTO } from "@src/domain/types";

export interface IUserService {
  createUser (userData: TUserCreateInput): Promise<Partial<TUserModel>>;
  getMe ({ userId }: Session): Promise<Partial<TUserModel>>;
  updateUser (session: Session, userData: TUserUpdateInput): Promise<void>;
  changePassword (session: Session, changePasswordDTO: ChangePasswordDTO): Promise<void>;
  getMe ({ userId }: Session): Promise<Partial<TUserModel>>;
  validateEmail (session: Session, verificationCode: string): Promise<void>;
  resendVerificationCode (session: Session): Promise<void>;
  removeUser (session: Session): Promise<void>;
}