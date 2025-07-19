import { Any, CrudObject, Id } from '@common/defs/types';
import { Creator } from '@modules/creators/defs/types';
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
