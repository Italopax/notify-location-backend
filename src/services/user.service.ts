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

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.repositories.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @inject(TYPES.adapters.ENCRYPTION_ADAPTER) private readonly encryptionAdapter: EncryptionAdapter,
    @inject(TYPES.adapters.EMAIL_ADAPTER) private readonly emailAdapter: EmailAdaptor,
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
    const verificationCode = this.generateEmailVerificationCode();
    
    await this.sendUserEmailVerificationCode(userData.email, verificationCode);

    return this.userRepository.create({
      ...userData,
      status: UserStatus.PENDING_VALIDATION,
      verificationCode,
      password: hashPassword,
    });
  }

  public async getMe ({ userId }: Session): Promise<Partial<TUserModel>> {
    if (!userId) {
      throw new BadRequest(Errors.INVALID_PARAMS);
    }

    const user = await this.userRepository.selectOne(
      { id: userId },
      { name: true, email: true }
    );

    if (!user) {
      throw new BadRequest(Errors.USER_NOT_FOUND);
    }

    return user;
  }

  public validateEmail = async (session: Session, verificationCode: string): Promise<void> => {
    const { userId } = session;

    const user = await this.userRepository.selectOne(
      { id: userId },
      { id: true, verificationCode: true, email: true, status: true }
    );

    if (!user) throw new BadRequest(Errors.USER_NOT_FOUND);

    if (user.status !== UserStatus.PENDING_VALIDATION) throw new BadRequest(Errors.USER_CANT_VALIDATE_EMAIL_ON_THIS_STATUS);

    if (user.verificationCode !== verificationCode) throw new BadRequest(Errors.INCORRECT_CODE);

    await this.userRepository.update(
      user.id,
      {
        status: UserStatus.ACTIVE,
        verificationCode: null,
      },
    );
  }

  public resendVerificationCode = async (session: Session): Promise<void> => {
    const { userId } = session;

    const user = await this.userRepository.selectOne(
      { id: userId },
      { id: true, email: true, status: true }
    );

    if (!user) throw new BadRequest(Errors.USER_NOT_FOUND);
 
    if (user.status !== UserStatus.PENDING_VALIDATION) throw new BadRequest(Errors.CANT_SEND_VERIFICATION_CODE_ON_THIS_STATUS);

    const verificationCode = this.generateEmailVerificationCode();

    await this.sendUserEmailVerificationCode(user.email, verificationCode);

    await this.userRepository.update(user.id, { verificationCode });
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
      await this.emailAdapter.sendEmail({
        userEmail,
        title,
        text,
      })
    } catch (error) {
      throw new BadRequest(Errors.EMAIL_SENDING_ERROR);
    }
  }

  private generateEmailVerificationCode(): string {
    return String(Math.floor(Math.random() * 1000000));
  }

  private async sendUserEmailVerificationCode(userEmail: string, verificationCode: string) {
    await this.sendEmail({
      userEmail,
      title: 'Email de verificação de criação de conta.',
      text: `Seu código de verificação é: ${verificationCode}`,
    });
  }
}