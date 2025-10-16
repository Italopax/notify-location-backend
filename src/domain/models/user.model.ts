import { UserEntity } from "@src/database/entities/user.entity";

export type TUserModel = TBaseModel & {
  email: string;
  name: string;
  password: string;
}

export type TUserCreateInput = Required<Pick<TUserModel, 'email' | 'name' | 'password'>>;
export type TUserUpdateInput = Partial<Pick<TUserModel, 'email' | 'name' | 'password'>>;

export type SelectUserAttributes = Partial<Record<keyof UserEntity, boolean>>;