import { Session } from "@src/domain/interfaces";
import { TUserCreateInput, TUserModel } from "@src/domain/models/user.model";
import { IUserService } from "@src/services/interface/user.interface";
import { TYPES } from "@src/utils/inversify/inversify-types";
import { auth } from "@src/utils/middlewares/auth";
import { Request } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, httpPost, interfaces, requestBody } from "inversify-express-utils";

@controller('/user')
export class UserController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(TYPES.services.USER_SERVICE) private readonly userService: IUserService
  ) {
    super();
  }

  @httpPost('/')
  private async create (
    @requestBody() userData: TUserCreateInput,
  ): Promise<Partial<TUserModel>> {
    const bodyInfos: TUserCreateInput = {
      email: userData.email,
      name: userData.name,
      password: userData.password,
    };

    return this.userService.createUser(bodyInfos);
  }

  @httpGet('/me', auth)
  private async getMe (
    { session }: Request,
  ): Promise<Partial<TUserModel>> {
    return this.userService.getMe(session);
  }
}