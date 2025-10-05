import { Column, Entity } from 'typeorm';
import { Base } from '@database/entities/base';

@Entity()
export class User extends Base {
  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public email: string;

  @Column({ type: 'varchar' })
  public password: string;
}