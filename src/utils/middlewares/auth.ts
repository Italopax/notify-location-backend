import { Request, Response, NextFunction } from "express";
import { Errors, Unauthorized } from "@utils/errors";
import { container } from "@utils/inversify/inversify.config";
import { TYPES } from "@utils/inversify/inversify-types";
import { IUserRepository } from "@src/database/repositories/interface/user.interface";
import { JwtAdapter } from "@src/adapters/jwt.adapter";


export const auth = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { authorization } = request.headers;
    const accessToken = authorization.split(' ')[1];

    if (!accessToken) throw new Unauthorized(Errors.USER_UNAUTHORIZED);

    const userRepository: IUserRepository = container.get(TYPES.repositories.USER_REPOSITORY);
    const jwtAdapter: JwtAdapter = container.get(TYPES.adapters.JWT_ADAPTER);
  
    const payload = jwtAdapter.verify(accessToken);

    const user = await userRepository.selectOneOrFail({ id: payload.userId }, { id: true });

    request.session = {
      userId: user.id,
    };

    next();
  } catch (error) {
    return next(new Unauthorized(Errors.USER_UNAUTHORIZED));
  }
};
