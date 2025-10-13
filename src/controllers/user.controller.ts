import { TUserCreateInput, TUserModel } from "@src/models/user.model";
import { IUserService } from "@src/services/interface/user.interface";
import { TYPES } from "@src/utils/inversify/inversify-types";
import { inject } from "inversify";
import { BaseHttpController, controller, httpPost, interfaces, requestBody } from "inversify-express-utils";

@controller('/user')
export class UserController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(TYPES.services.USER_SERVICE) private readonly userService: IUserService
  ) {
    super();
  }

  @httpPost('/')
  public async create (
    @requestBody() userData: TUserCreateInput,
    response: Response,
  ): Promise<Partial<TUserModel>> {
    const bodyInfos: TUserCreateInput = {
      email: userData.email,
      name: userData.name,
      password: userData.password,
    };

    return this.userService.createUser(bodyInfos);
  }
}