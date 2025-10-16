import { LoginCredentials, LoginOutput, RefreshTokenOutput } from "@src/domain/interfaces";
import { IAuthService } from "@src/services/interface/auth.interface";
import { TYPES } from "@src/utils/inversify/inversify-types";
import { auth } from "@src/utils/middlewares/auth";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, httpPost, interfaces, requestBody } from "inversify-express-utils";

@controller('/auth')
export class AuthController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(TYPES.services.AUTH_SERVICE) private readonly authService: IAuthService,
  ) {
    super();
  }

  @httpPost('/login')
  private async login (
    @requestBody() loginInfos: LoginCredentials,
    _response: Response,
  ): Promise<LoginOutput> {
    const authInfos: LoginCredentials = {
      email: loginInfos.email,
      password: loginInfos.password,
    };

    return this.authService.login(authInfos);
  }

  @httpPost('/refresh-token')
  private async refreshToken (
    @requestBody() { refreshToken }: { refreshToken: string },
    _response: Response,
  ): Promise<RefreshTokenOutput> {
    return this.authService.refreshAccessToken(refreshToken);
  }
}