import { Request, Response, NextFunction } from "express";
import { BadRequest, Errors, Unauthorized } from "@utils/errors";
import { container } from "@utils/inversify/inversify.config";
import { TYPES } from "@utils/inversify/inversify-types";
import { IUserRepository } from "@src/database/repositories/interface/user.interface";
import { UserStatus } from "@src/domain/enums";

export const validateUserStatus = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.session;

    if (!userId) throw new Unauthorized(Errors.USER_UNAUTHORIZED);

    const userRepository: IUserRepository = container.get(TYPES.repositories.USER_REPOSITORY);
  
    await userRepository.selectOneOrFail({ id: userId, status: UserStatus.ACTIVE }, { status: true });

    next();
  } catch (error) {
    return next(new BadRequest(Errors.INVALID_USER_STATUS));
  }
};
