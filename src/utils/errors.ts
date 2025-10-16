import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { getEnv } from "./constants";

export enum Errors {
  USER_UNAUTHORIZED = "Usuário não autorizado",
  USER_ALREADY_CREATED = "Usuário já existente.",
  USER_NOT_FOUND = "Usuário não encontrado.",
  USER_OR_PASSWORD_INVALID = "Usuário ou senha incorretos.",
  INVALID_PASSWORD = "Senha incorreta.",
  USER_CANT_VALIDATE_EMAIL_ON_THIS_STATUS = "Usuário não pode validar seu email estando neste estatus.",
  INVALID_USER_STATUS = "Não é possível acessar esta funcionalidade no estatus atual.",
  INCORRECT_CODE = "Código incorreto.",
  INVALID_DATA_FORMAT = "Formato incorreto das informações.",
  INVALID_PARAMS = "Parâmetros inválidos.",
  INTERNAL_SERVER_ERROR = "Ocorreu um erro desconhecido.",
  EMAIL_SENDING_ERROR = "Erro ao enviar email.",
  CANT_SEND_VERIFICATION_CODE_ON_THIS_STATUS = "Não é possível reenviar o código de verificação neste estatus.",
  EMAIL_IN_USE = "Email já utilizado",
  ITEMS_GROUP_WITH_THIS_NAME_ALREADY_EXIST = "Nome de grupo de itens já utilizado.",
  ITEMS_GROUP_NOT_FOUND = "Grupo de itens não encontrado.",
  ITEM_WITH_THIS_NAME_ALREADY_CREATED = "Item com mesmo nome já criado.",
  ITEM_NOT_FOUND = "Item não encontrado",
}

enum ErrorsName {
  BAD_REQUEST = "BadRequest",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  INTERNAL_SERVER_ERROR = "InternalServerError",
}

export class BadRequest extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = ErrorsName.BAD_REQUEST;
    this.statusCode = httpStatus.BAD_REQUEST;
  }
}

export class Unauthorized extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = ErrorsName.UNAUTHORIZED;
    this.statusCode = httpStatus.UNAUTHORIZED;
  }
}

export class Forbidden extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = ErrorsName.FORBIDDEN;
    this.statusCode = httpStatus.FORBIDDEN;
  }
}

export class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = ErrorsName.INTERNAL_SERVER_ERROR;
    this.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  }
}

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction): void {
  switch (true) {
    case error instanceof BadRequest:
    case error instanceof Unauthorized:
    case error instanceof Forbidden:
      res.status(error.statusCode).send({
        errorMessage: error.message,
        status: error.statusCode,
        type: error.name,
      });
      break;

    default:
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        errorMessage: Errors.INTERNAL_SERVER_ERROR,
        status: httpStatus.INTERNAL_SERVER_ERROR,
        type: Errors.INTERNAL_SERVER_ERROR,
        ...(getEnv().debbug && { stack: error.stack })
      });
  }
}