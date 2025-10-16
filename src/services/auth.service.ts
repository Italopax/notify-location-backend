import { inject, injectable } from "inversify";
import { TYPES } from "@src/utils/inversify/inversify-types";
import { IUserRepository } from "@src/database/repositories/interface/user.interface";
import { BadRequest, Errors, Unauthorized } from "@src/utils/errors";
import { EncryptionAdapter } from "@src/adapters/encryption.adapter";
import { LoginCredentials, LoginOutput, RefreshTokenOutput } from "@src/domain/interfaces";
import { IAuthService } from "./interface/auth.interface";
import { JwtAdapter } from "@src/adapters/jwt.adapter";
import { getEnv } from "@src/utils/constants";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.repositories.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @inject(TYPES.adapters.ENCRYPTION_ADAPTER) private readonly encryptionAdapter: EncryptionAdapter,
    @inject(TYPES.adapters.JWT_ADAPTER) private readonly jwtAdapter: JwtAdapter,
  ) {}

  public async login (authInfos: LoginCredentials): Promise<LoginOutput> {
    if (!authInfos.email || !authInfos.password) {
      throw new BadRequest(Errors.INVALID_PARAMS);
    }

    const userExist = await this.userRepository.selectOne({ email: authInfos.email });
    if (!userExist) throw new BadRequest(Errors.USER_OR_PASSWORD_INVALID);

    const passwordIsCorrect = userExist.password === this.encryptionAdapter.generateHash(authInfos.password);;
    if (!passwordIsCorrect) throw new Unauthorized(Errors.USER_OR_PASSWORD_INVALID);

    const accessToken = this.jwtAdapter.generateToken({ userId: userExist.id }, getEnv().jwt.accessTokenExpiration);
    const refreshToken = this.jwtAdapter.generateToken({ userId: userExist.id }, getEnv().jwt.refreshTokenExpiration);

    return {
      accessToken,
      refreshToken
    }
  }

  public refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenOutput> => {
    if (!refreshToken) throw new BadRequest(Errors.INVALID_PARAMS);

    const tokenPayload = this.jwtAdapter.decodeToken(refreshToken);
    const user = await this.userRepository.selectOne({ id: tokenPayload.userId });
    if (!user) throw new BadRequest(Errors.USER_NOT_FOUND);

    const accessToken = this.jwtAdapter.generateToken({ userId: user.id }, getEnv().jwt.accessTokenExpiration);

    return {
      accessToken,
    };
  }
}