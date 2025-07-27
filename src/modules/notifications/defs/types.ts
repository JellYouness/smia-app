import { CrudObject } from '@common/defs/types';

export enum NotificationType {
  PROJECT_INVITE = 'project_invite',
  PROJECT_UPDATE = 'project_update',
  PROJECT_COMPLETED = 'project_completed',
  PROPOSAL_RECEIVED = 'proposal_received',
  PROPOSAL_ACCEPTED = 'proposal_accepted',
  PROPOSAL_REJECTED = 'proposal_rejected',
  MESSAGE_RECEIVED = 'message_received',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  PROFILE_UPDATE = 'profile_update',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_SENT = 'payment_sent',
  ACCOUNT_VERIFIED = 'account_verified',
  APPLICATION_SUBMITTED = 'application_submitted',
  APPLICATION_APPROVED = 'application_approved',
  APPLICATION_REJECTED = 'application_rejected',
  APPLICATION_PENDING = 'application_pending',
  WELCOME = 'welcome',
  REMINDER = 'reminder',
  SECURITY_ALERT = 'security_alert',
  TEAM_INVITATION_ACCEPTED = 'team_invitation_accepted',
  TEAM_INVITATION_DECLINED = 'team_invitation_declined',
}

export interface Notification extends CrudObject {
  type: NotificationType;
  notifiableType: string;
  notifiableId: number;
  data: Record<string, any>;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTypeOption {
  value: NotificationType;
  label: string;
  icon: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  read?: boolean;
  perPage?: number;
  page?: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  unreadCount: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
