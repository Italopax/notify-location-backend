import { TUserCreateInput, TUserModel, TUserUpdateInput } from "@domain/models/user.model";
import { IUserService } from "./interface/user.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@src/utils/inversify/inversify-types";
import { IUserRepository } from "@src/database/repositories/interface/user.interface";
import { BadRequest, Errors } from "@src/utils/errors";
import { validateEmail } from "@src/utils";
import { EncryptionAdapter } from "@src/adapters/encryption.adapter";
import { Session } from "@domain/interfaces";
import { UserStatus } from "@src/domain/enums";
import { EmailAdaptor } from "@src/adapters/email.adaptor";
import { Not } from "typeorm";
import { ChangePasswordDTO, RecoveryPasswordDTO } from "@src/domain/types";
import { IEmailPublisher } from "@src/queues/producers/interfaces/emailProducer.interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.repositories.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @inject(TYPES.adapters.ENCRYPTION_ADAPTER) private readonly encryptionAdapter: EncryptionAdapter,
    @inject(TYPES.adapters.EMAIL_ADAPTER) private readonly emailAdapter: EmailAdaptor,
    @inject(TYPES.queue.producers.EMAIL_PUBLISHER) private readonly emailPublisher: IEmailPublisher,
  ) {}

  public async createUser (userData: TUserCreateInput): Promise<Partial<TUserModel>> {
    if (
      !validateEmail(userData.email) ||
      !userData.name ||
      !userData.password
    ) {
      throw new BadRequest(Errors.INVALID_PARAMS);
    }

    const userAlreadyExist = await this.userRepository.selectOne({ email: userData.email });
    if (userAlreadyExist) {
      throw new BadRequest(Errors.USER_ALREADY_CREATED);
    }

    const hashPassword = this.encryptionAdapter.generateHash(userData.password);
    const { code, codeHash } = this.generateEmailVerificationCode();
    
    await this.sendUserEmailVerificationCode(userData.email, code);

    return this.userRepository.create(
      {
        ...userData,
        status: UserStatus.PENDING_VALIDATION,
        verificationCode: codeHash,
        password: hashPassword,
      },
      { name: true, email: true, status: true }
    );
  }

  public async getMe ({ userId }: Session): Promise<Partial<TUserModel>> {
    if (!userId) {
      throw new BadRequest(Errors.INVALID_PARAMS);
    }

    const user = await this.userRepository.selectOne(
      { id: userId },
      { name: true, email: true, status: true }
    );

    if (!user) {
      throw new BadRequest(Errors.USER_NOT_FOUND);
    }

    return user;
  }

  public async updateUser (session: Session, userDataDTO: TUserUpdateInput): Promise<void> {
    const { userId } = session;

    const userData: TUserUpdateInput = {};

    if (userDataDTO.email) userData.email = userDataDTO.email;
    if (userDataDTO.name) userData.name = userDataDTO.name;

    const withoutFieldToUpdate = Object.keys(userData).length === 0;
    if (withoutFieldToUpdate) throw new BadRequest(Errors.INVALID_PARAMS);

    if (userData.email && !validateEmail(userData.email)) throw new BadRequest(Errors.EMAIL_INVALID);;

    const user = await this.userRepository.selectOne(
      { id: userId },
      { name: true, email: true }
    );

    if (!user) throw new BadRequest(Errors.USER_NOT_FOUND);

    const isSameUserData = Object.keys(userData).every((key: string): boolean => {
      const keyField = key as unknown as keyof TUserUpdateInput;
      return userData[keyField] === user[keyField];
    });

    if (isSameUserData) throw new BadRequest(Errors.USER_DATA_SENT_IS_SAME_AS_ACTUAL_DATA);

    if (userData.email && userData.email !== user.email) {
      const emailAlreadyUsed = await this.userRepository.selectOne({ email: userData.email, id: Not(user.id) });
      if (emailAlreadyUsed) throw new BadRequest(Errors.USER_ALREADY_CREATED);
    }

    const userNewData: TUserUpdateInput = {
      ...(userData.name && { name: userData.name }),
    };

    if (userData.email) {
      const { code, codeHash } = this.generateEmailVerificationCode();
      await this.sendUserEmailVerificationCode(userData.email, code);

      userNewData.email = userData.email;
      userNewData.status = UserStatus.PENDING_VALIDATION;
      userNewData.verificationCode = codeHash;
    }

    await this.userRepository.update(userId, userNewData);
  }

  public async changePassword (session: Session, changePasswordDTO: ChangePasswordDTO): Promise<void> {
    const { userId } = session;

    if (!changePasswordDTO.actualPassword || !changePasswordDTO.newPassword) throw new BadRequest(Errors.INVALID_PARAMS);

    const user = await this.userRepository.selectOne(
      { id: userId },
      { password: true },
    );

    if (!user) throw new BadRequest(Errors.USER_NOT_FOUND);

    const actualPasswordSent = this.encryptionAdapter.generateHash(changePasswordDTO.actualPassword);
    const actualPasswordIsIncorrect = user.password !== actualPasswordSent;

    if (actualPasswordIsIncorrect) throw new BadRequest(Errors.INVALID_PASSWORD);

    const newPasswordHash = this.encryptionAdapter.generateHash(changePasswordDTO.newPassword);

    await this.userRepository.update(userId, { password: newPasswordHash });
  }

  public async validateEmail (session: Session, verificationCode: string): Promise<void> {
    const { userId } = session;

    const user = await this.userRepository.selectOne(
      { id: userId },
      { id: true, verificationCode: true, email: true, status: true }
    );

    if (!user) throw new BadRequest(Errors.USER_NOT_FOUND);

    if (user.status !== UserStatus.PENDING_VALIDATION) throw new BadRequest(Errors.USER_CANT_VALIDATE_EMAIL_ON_THIS_STATUS);

    const verificationCodeInvalid = user.verificationCode !== this.encryptionAdapter.generateHash(verificationCode);
    if (verificationCodeInvalid) throw new BadRequest(Errors.INCORRECT_CODE);

    await this.userRepository.update(
      user.id,
      {
        status: UserStatus.ACTIVE,
        verificationCode: null,
      },
    );
  }

  public async resendVerificationCode (session: Session): Promise<void> {
    const { userId } = session;

    const user = await this.userRepository.selectOne(
      { id: userId },
      { id: true, email: true, status: true }
    );

    if (!user) throw new BadRequest(Errors.USER_NOT_FOUND);
 
    if (user.status !== UserStatus.PENDING_VALIDATION) throw new BadRequest(Errors.CANT_SEND_VERIFICATION_CODE_ON_THIS_STATUS);

    const { code, codeHash } = this.generateEmailVerificationCode();

    await this.sendUserEmailVerificationCode(user.email, code);

    await this.userRepository.update(user.id, { verificationCode: codeHash });
  }

  public async removeUser (session: Session): Promise<void> {
    const { userId } = session;

    if (!userId) throw new BadRequest(Errors.INVALID_PARAMS);

    const user = await this.userRepository.selectOne(
      { id: userId },
      { id: true, email: true, status: true }
    );

    if (!user) throw new BadRequest(Errors.USER_NOT_FOUND);

    await this.userRepository.softDelete(user.id);
  }

  public async sendRecoveryPasswordCode (_session: Session, email: string): Promise<void> {
    if (!email) throw new BadRequest(Errors.INVALID_PARAMS);
  
    if (!validateEmail(email)) throw new BadRequest(Errors.EMAIL_INVALID)

    const user = await this.userRepository.selectOne({ email }, { id: true, email: true });
 
    if (!user) throw new BadRequest(Errors.USER_NOT_FOUND);

    const { code, codeHash } = this.generateEmailVerificationCode();

    await this.sendUserEmailVerificationCode(user.email, code);

    await this.userRepository.update(user.id, { verificationCode: codeHash, status: UserStatus.PENDING_VALIDATION });
  }

  public async recoveryPassword (sesion: Session, { email, verificationCode, newPassword }: RecoveryPasswordDTO): Promise<void> {
    if (!email || !verificationCode || !newPassword) throw new BadRequest(Errors.INVALID_PARAMS);

    if (!validateEmail(email)) throw new BadRequest(Errors.EMAIL_INVALID)

    const user = await this.userRepository.selectOne({ email }, { id: true, verificationCode: true, status: true });

    if (!user) throw new BadRequest(Errors.USER_NOT_FOUND);

    if (user.status !== UserStatus.PENDING_VALIDATION) throw new BadRequest(Errors.USER_CANT_RECOVERY_PASSWORD_ON_THIS_STATUS);

    const verificationCodeInvalid = user.verificationCode !== this.encryptionAdapter.generateHash(verificationCode);
    if (verificationCodeInvalid) throw new BadRequest(Errors.INCORRECT_CODE);

    const newPasswordHash = this.encryptionAdapter.generateHash(newPassword);

    await this.userRepository.update(user.id, { password: newPasswordHash });
  }

  private async sendEmail({
    userEmail,
    title,
    text,
  }: {
    userEmail: string;
    title: string;
    text: string;
  }): Promise<void> {
    try {
      await this.emailPublisher.publishEmailTask({
        userEmail,
        title,
        text,
      });
    } catch (error) {
      throw new BadRequest(Errors.EMAIL_SENDING_ERROR);
    }
  }

  private generateEmailVerificationCode(): { code: string, codeHash: string } {
    const verificationCode = String(Math.floor(Math.random() * 1000000));
    const verificationCodeHash = this.encryptionAdapter.generateHash(verificationCode);

    return {
      code: verificationCode,
      codeHash: verificationCodeHash
    };
  }

  private async sendUserEmailVerificationCode(userEmail: string, verificationCode: string) {
    await this.sendEmail({
      userEmail,
      title: 'Email de verificação de criação de conta.',
      text: `Seu código de verificação é: ${verificationCode}`,
    });
  }
}