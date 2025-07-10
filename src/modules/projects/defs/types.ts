import { CrudObject, Id } from '@common/defs/types';
import { User } from '@modules/users/defs/types';

export enum PROJECT_STATUS {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Project extends CrudObject {
  title: string;
  description?: string;
  status: PROJECT_STATUS;
  startDate?: string;
  endDate?: string;
  budget?: number;
  clientId?: Id;
  client?: User;
  creatorId?: Id;
  creator?: User;
  ambassadorId?: Id;
  ambassador?: User;
}
