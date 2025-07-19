import { CrudObject, Id } from '@common/defs/types';
import { User } from '@modules/users/defs/types';

export enum PROJECT_STATUS {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
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
  proposalsCount?: number;
  hiresCount?: number;
  invitedCreatorIds?: number[];
}
