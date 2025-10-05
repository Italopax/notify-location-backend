export class Constants {
  public debbug: boolean;
  public corsOriginsAllowed: string;

  public database: {
    host: string;
    port: number;
    username: string;
    database: string;
    password: string;
  }

  public jwt: {
    secretKey: string;
    accessTokenExpiration: number;
    refreshTokenExpiration: number;
  }

  public email: {
    user: string;
    password: string;
    host: string;
    port: number;
    secure: boolean;
  }

  constructor(props: Record<string, string> ) {
    this.debbug = props.DEBBUG === 'true',
    this.corsOriginsAllowed = props.CORS_ORIGINS_ALLOWED,

    this.database = {
      host: props.DATABASE_HOST,
      port: Number(props.DATABASE_PORT),
      username: props.DATABASE_USERNAME,
      database: props.DATABASE_NAME,
      password: props.DATABASE_PASSWORD,
    }

    this.jwt = {
      secretKey: props.JWT_SECRET,
      accessTokenExpiration: Number(props.ACCESS_TOKEN_EXPIRATION),
      refreshTokenExpiration: Number(props.REFRESH_TOKEN_EXPIRATION),
    }

    this.email = {
      user: props.EMAIL_SENDER,
      password: props.EMAIL_SENDER_PASSWORD,
      host: props.EMAIL_SENDER_HOST,
      port: Number(props.EMAIL_SENDER_PORT),
      secure: Boolean(props.EMAIL_SENDER_SECURE),
    }
  }
}

let ConstantsEnv: Constants;

export const initializeEnvs = (envs: Record<string, string>): void => {
  ConstantsEnv = new Constants(envs);
}

export const getEnv = (): Constants => ConstantsEnv;