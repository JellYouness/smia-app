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
  WELCOME = 'welcome',
  REMINDER = 'reminder',
  SECURITY_ALERT = 'security_alert',
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
