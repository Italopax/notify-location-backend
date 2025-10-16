import { TUserCreateInput, TUserModel } from "@src/domain/models/user.model";

export interface IUserService {
  createUser (userData: TUserCreateInput): Promise<Partial<TUserModel>>
}