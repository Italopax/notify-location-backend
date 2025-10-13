import { TUserCreateInput, TUserModel } from "@src/models/user.model";
import { IUserService } from "./interface/user.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@src/utils/inversify/inversify-types";
import { IUserRepository } from "@src/database/repositories/interface/user.interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.repositories.USER_REPOSITORY) private readonly userRepository: IUserRepository
  ) {}

  public async createUser (userData: TUserCreateInput): Promise<Partial<TUserModel>> {
    return this.userRepository.create(userData);
  }
}