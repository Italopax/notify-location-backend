import { TableColumnOptions } from 'typeorm';

export const baseColumns: TableColumnOptions[] = [
  {
    name: 'id',
    type: 'uuid',
    isPrimary: true,
    generationStrategy: 'uuid',
    default: 'uuid_generate_v4()',
  },
  {
    name: 'createdAt',
    type: 'timestamptz',
    default: 'now()',
  },
  {
    name: 'updatedAt',
    type: 'timestamptz',
    isNullable: true,
  },
  {
    name: 'deletedAt',
    type: 'timestamptz',
    isNullable: true,
  }
];