import { LoginCredentials, LoginOutput, RefreshTokenOutput } from "@src/domain/interfaces";

export interface IAuthService {
  login (authInfos: LoginCredentials): Promise<LoginOutput>;
  refreshAccessToken(refreshToken: string): Promise<RefreshTokenOutput>;
}