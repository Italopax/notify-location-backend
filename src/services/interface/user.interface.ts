import { TUserCreateInput, TUserModel } from "@src/models/user.model";

export interface IUserService {
  createUser (userData: TUserCreateInput): Promise<Partial<TUserModel>>
}