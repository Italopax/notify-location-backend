import { Column, Entity } from 'typeorm';
import { Base } from '@database/entities/base';
import { UserStatus } from '@src/domain/enums';

@Entity('user')
export class UserEntity extends Base {
  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public email: string;

  @Column({ type: 'varchar' })
  public password: string;

  @Column({ type: 'enum', enum: UserStatus })
  status: UserStatus;

  @Column({ type: 'varchar' })
  verificationCode: string;
}