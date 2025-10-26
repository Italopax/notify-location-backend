import { UserEntity } from "@src/database/entities/user.entity";
import { UserStatus } from "../enums";

export type TUserModel = TBaseModel & {
  email: string;
  name: string;
  password: string;
  status: UserStatus;
  verificationCode: string;
}

export type TUserCreateInput = Required<Pick<TUserModel, 'email' | 'name' | 'password'>>;
export type TUserUpdateInput = Partial<Pick<TUserModel, 'email' | 'name' | 'password' | 'verificationCode' | 'status'>>;

export type SelectUserAttributes = Partial<Record<keyof UserEntity, boolean>>;