import { UserEntity } from "@src/database/entities/user.entity";
import { SelectUserAttributes, TUserCreateInput, TUserModel } from "@src/models/user.model";
import { FindOptionsWhere } from "typeorm";

export interface IUserRepository {
  selectOne(where: FindOptionsWhere<UserEntity>, selectAttributes?: SelectUserAttributes): Promise<TUserModel>;
  selectMany(where: FindOptionsWhere<UserEntity>, selectAttributes?: SelectUserAttributes): Promise<TUserModel[]>;
  create(user: TUserCreateInput, selectAttributes?: SelectUserAttributes): Promise<TUserModel>;
  update(userId: string, updateData: Partial<TUserModel>, selectAttributes?: SelectUserAttributes): Promise<TUserModel>;
}
