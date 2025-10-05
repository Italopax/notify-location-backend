import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class Base {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  public createdAt: Date;

  @UpdateDateColumn({type: 'timestamptz', nullable: true })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}