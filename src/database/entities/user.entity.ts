import { Column, Entity } from 'typeorm';
import { Base } from '@database/entities/base';

@Entity('user')
export class UserEntity extends Base {
  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public email: string;

  @Column({ type: 'varchar' })
  public password: string;
}