import { CRUD_ACTION, Id } from '@common/defs/types';

export enum ROLE {
  CLIENT = 'client',
  CREATOR = 'creator',
  AMBASSADOR = 'ambassador',
  SYSTEM_ADMINISTRATOR = 'system_administrator',
}

export interface Permission {
  entity: string;
  action: string | CRUD_ACTION | CRUD_ACTION[];
  entityId?: Id;
  entityQueryKey?: string;
}

export type PermissionCheck =
  | Permission
  | Permission[]
  | { and: PermissionCheck[]; or?: never; not?: never }
  | { or: PermissionCheck[]; and?: never; not?: never }
  | { not: PermissionCheck[]; and?: never; or?: never };
