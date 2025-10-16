import { getEnv } from "@src/utils/constants";
import { BadRequest, Errors } from "@src/utils/errors";
import jwt from "jsonwebtoken";

export class JwtAdapter {
  public generateToken(data: Record<string, any>, expirationTime: number): string {
    const token = jwt.sign(
      data,
      getEnv().jwt.secretKey,
      { expiresIn: expirationTime },
    );

    return token;
  }

  public decodeToken(token: string): { userId: string } {
    try {
      const decodedInfos = jwt.verify(token, getEnv().jwt.secretKey);
      return decodedInfos as { userId: string };
    } catch (error) {
      throw new BadRequest(Errors.INVALID_PARAMS);
    }
  }

  public verify(accessToken: string): { userId: string } {
    return jwt.verify(accessToken, getEnv().jwt.secretKey) as { userId: string };
  }
}