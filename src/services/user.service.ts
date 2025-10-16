import { TUserCreateInput, TUserModel } from "@src/domain/models/user.model";
import { IUserService } from "./interface/user.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@src/utils/inversify/inversify-types";
import { IUserRepository } from "@src/database/repositories/interface/user.interface";
import { BadRequest, Errors } from "@src/utils/errors";
import { validateEmail } from "@src/utils";
import { EncryptionAdapter } from "@src/adapters/encryption.adapter";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.repositories.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @inject(TYPES.adapters.ENCRYPTION_ADAPTER) private readonly encryptionAdapter: EncryptionAdapter,
  ) {}

  public async createUser (userData: TUserCreateInput): Promise<Partial<TUserModel>> {
    if (
      !validateEmail(userData.email) ||
      !userData.name ||
      !userData.password
    ) {
      throw new BadRequest(Errors.INVALID_PARAMS);
    }

    const userAlreadyExist = await this.userRepository.selectOne({ email: userData.email });
    if (userAlreadyExist) {
      throw new BadRequest(Errors.USER_ALREADY_CREATED);
    }

    const hashPassword = this.encryptionAdapter.generateHash(userData.password);

    return this.userRepository.create({
      ...userData,
      password: hashPassword,
    });
  }
}