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
