import { Any, CrudObject, Id } from '@common/defs/types';
import { Ambassador } from '@modules/ambassadors/defs/types';
import { Client } from '@modules/clients/defs/types';
import { Creator } from '@modules/creators/defs/types';
import { User } from '@modules/users/defs/types';

export enum PROJECT_STATUS {
  DRAFT = 'DRAFT',
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
  creatorId?: Id;
  ambassadorId?: Id;

  client?: User;
  creator?: Creator;
  ambassador?: Ambassador;
  invites?: ProjectInvite[];
  proposalsCount?: number;
  hiresCount?: number;
  projectCreators?: ProjectCreator[];
}

export interface ProjectCreator {
  id: Id;
  projectId: Id;
  creatorId: Id;
  role?: string;
  status?: PROJECT_CREATOR_STATUS;
  permission: PROJECT_CREATOR_PERMISSION | null;
  creator?: Creator;
}

export interface ProjectInvite {
  id: Id;
  projectId: Id;
  creatorId: Id;
  message: string | null;
  status: PROJECT_INVITE_STATUS;
  expiresAt: string | null;
  acceptedAt: string | null;
  declinedAt: string | null;

  project?: Project;
  creator?: Creator;
}

export enum PROJECT_INVITE_STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

export enum PROJECT_INVITE_FILTER {
  ALL = 'ALL',
  UNINVITED = 'UNINVITED',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export interface ProjectProposal extends CrudObject {
  inviteId: Id;
  projectId: Id;
  creatorId: Id;
  amount?: number;
  currency?: string;
  durationDays?: number;
  coverLetter?: string;
  attachments?: Any[];
  status: PROJECT_PROPOSAL_STATUS;
  meta?: Any;

  invite?: ProjectInvite;
  project?: Project;
  creator?: Creator;
}

export enum PROJECT_PROPOSAL_STATUS {
  PENDING = 'PENDING',
  WITHDRAWN = 'WITHDRAWN',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

export interface ProjectProposalComment extends CrudObject {
  proposalId: Id;
  userId: Id;
  parentId: Id;
  body: string;
  attachments?: Any[];
  readAt?: string;

  parent?: ProjectProposalComment;
  children?: ProjectProposalComment[];
}

export interface ProjectUpdate extends CrudObject {
  projectId: Id;
  clientId: Id;
  ambassadorId: Id;
  body: string;
  type: PROJECT_UPDATE_TYPE;

  project?: Project;
  client?: Client;
  ambassador?: Ambassador;
}

export enum PROJECT_UPDATE_TYPE {
  UPDATE = 'UPDATE',
  REPORT_REQUEST = 'REPORT_REQUEST',
}

export enum PROJECT_CREATOR_PERMISSION {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
}

export enum PROJECT_CREATOR_STATUS {
  CONFIRMED = 'CONFIRMED',
  ASSIGNED = 'ASSIGNED',
}
