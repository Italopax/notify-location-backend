import { TUserCreateInput, TUserModel } from "@src/domain/models/user.model";
import { IUserService } from "@src/services/interface/user.interface";
import { TYPES } from "@src/utils/inversify/inversify-types";
import { auth } from "@src/utils/middlewares/auth";
import { Request } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, httpGet, httpPost, interfaces, request, requestBody } from "inversify-express-utils";
import httpStatus from "http-status";
import { StatusCodeResult } from "inversify-express-utils/lib/cjs/results";

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
    @request() { session }: Request,
  ): Promise<Partial<TUserModel>> {
    return this.userService.getMe(session);
  }

  @httpPost('/validate-email', auth)
  private async verifyEmailToken (
    @request() { session }: Request,
    @requestBody() { verificationCode }: { verificationCode: string }
  ): Promise<StatusCodeResult> {
    await this.userService.validateEmail(session, verificationCode);
    return this.statusCode(httpStatus.NO_CONTENT);
  }

  @httpPost('/resend-verification-code', auth)
  private async resendVerificationCode (
    @request() { session }: Request,
  ): Promise<StatusCodeResult> {
    await this.userService.resendVerificationCode(session);
    return this.statusCode(httpStatus.NO_CONTENT);
  }

  @httpDelete('/', auth)
  private async deleteUser (
    @request() { session }: Request,
  ): Promise<StatusCodeResult> {
    await this.userService.removeUser(session);
    return this.statusCode(httpStatus.NO_CONTENT);
  }
}