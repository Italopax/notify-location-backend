import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '@database/config/base-columns.js';

export class AddUser1759695370748 implements MigrationInterface {
  private readonly tableName = 'user';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.getTable(this.tableName);

    if (tableExists) return;

    await queryRunner.createTable(new Table({
      name: this.tableName,
      columns: [
        {
          name: 'name',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'email',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'password',
          type: 'varchar',
          isNullable: false,
        },
        ...baseColumns,
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.getTable(this.tableName);

    if (!tableExists) return;

    await queryRunner.dropTable(this.tableName);
  }
}
