import { SelectUserAttributes, TUserModel } from "@src/domain/models/user.model";
import { IUserRepository } from "./interface/user.interface";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { inject, injectable } from "inversify";
import { TYPES } from "@src/utils/inversify/inversify-types";

@injectable()
export class UserRepository implements IUserRepository {
  private readonly repository: Repository<UserEntity>;

  constructor(@inject(TYPES.DATABASE_SOURCE) private readonly databaseSource: DataSource) {
    this.repository = this.databaseSource.getRepository(UserEntity);
  }   

  public async selectOne(where: FindOptionsWhere<UserEntity>, selectAttributes?: SelectUserAttributes): Promise<TUserModel> {
    return this.repository.findOne({
      where,
      ...(selectAttributes && { select: { ...selectAttributes }})
    });
  }

  public async selectOneOrFail(where: FindOptionsWhere<UserEntity>, selectAttributes?: SelectUserAttributes): Promise<TUserModel> {
    return this.repository.findOneOrFail({
      where,
      ...(selectAttributes && { select: { ...selectAttributes }})
    });
  }

  public async selectMany(where: FindOptionsWhere<UserEntity>, selectAttributes?: SelectUserAttributes): Promise<TUserModel[]> {
    return this.repository.find({
      where,
      ...(selectAttributes && { select: { ...selectAttributes }})
    });
  }

  public async create(user: Partial<TUserModel>, selectAttributes?: SelectUserAttributes): Promise<TUserModel> {
    const userObject = this.repository.create(user);
    const { id } = await this.repository.save(userObject);

    return this.selectOne({ id }, selectAttributes);
  }

  public async update(userId: string, updateData: Partial<TUserModel>, selectAttributes?: SelectUserAttributes): Promise<TUserModel> {
    await this.repository.update(userId, updateData);
    return this.selectOne({ id: userId }, selectAttributes);
  }

  public async softDelete(userId: string): Promise<void> {
    await this.repository.softDelete({ id: userId });
  }
}