import { ProjectProposalComment } from '@modules/projects/defs/types';

export const creatorStatusColour = {
  PENDING: 'info',
  ACCEPTED: 'success',
  DECLINED: 'error',
  EXPIRED: 'default',
} as const;

export const proposalStatusColour = {
  PENDING: 'info',
  AWARDED: 'success',
  REJECTED: 'error',
  WITHDRAWN: 'warning',
} as const;

export const countComments = (items: ProjectProposalComment[]): number =>
  items.reduce((total, c) => total + 1 + (c.children ? countComments(c.children) : 0), 0);
