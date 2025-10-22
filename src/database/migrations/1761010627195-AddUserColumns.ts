import { UserStatus } from "@src/domain/enums";
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddStatusColumn1761010627195 implements MigrationInterface {
  private readonly tableName = 'user';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columnStatus = await queryRunner.hasColumn(this.tableName, 'status');

    if (!columnStatus) {
      await queryRunner.addColumn(this.tableName, new TableColumn({
        name: 'status',
        type: 'int',
        isNullable: false,
        default: UserStatus.PENDING_VALIDATION,
      }));
    }

    const columnVerificationCode = await queryRunner.hasColumn(this.tableName, 'verificationCode');

    if (!columnVerificationCode) {
      await queryRunner.addColumn(this.tableName, new TableColumn({
        name: 'verificationCode',
        type: 'varchar',
        isNullable: true,
      }));
    };
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columnStatus = await queryRunner.hasColumn(this.tableName, 'status');
    if (columnStatus) await queryRunner.dropColumn(this.tableName, 'status');

    const columnVerificationCode = await queryRunner.hasColumn(this.tableName, 'verificationCode');
    if (columnVerificationCode) await queryRunner.dropColumn(this.tableName, 'verificationCode');
  }
}
