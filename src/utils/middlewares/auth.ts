import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getEnv } from "../constants";
import { Errors, Unauthorized } from "@utils/errors";
import { container } from "@utils/inversify/inversify.config";
import { TYPES } from "@utils/inversify/inversify-types";
import { IUserRepository } from "@src/database/repositories/interface/user.interface";

const ConstantEnvs = getEnv();

export const auth = async (request: Request, response: Response, next: NextFunction) => {
  const { authorization } = request.headers;
  const accessToken = authorization.split(' ')[1];

  if (!accessToken) throw new Unauthorized(Errors.USER_UNAUTHORIZED);

  const userRepository: IUserRepository = container.get(TYPES.repositories.USER_REPOSITORY);

  try {
    const payload = jwt.verify(accessToken, ConstantEnvs.jwt.secretKey) as jwt.JwtPayload;
    console.log('payload:', payload)
    const user = await userRepository.selectOneOrFail({
      id: payload.userId,
    });

    request.session = {
      userId: user.id,
    };

    next();
  } catch (error) {
    throw new Unauthorized(Errors.USER_UNAUTHORIZED);
  }
};
