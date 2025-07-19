import { CrudObject } from '@common/defs/types';

export interface Conversation extends CrudObject {
  type: 'direct' | 'group' | 'project';
  name?: string;
  projectId?: number;
  participants: Participant[];
  latestMessage?: Message;
  unreadCount?: number;
}

export interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  role: 'admin' | 'member';
  joinedAt: string;
  lastReadAt?: string;
}

export interface Message extends CrudObject {
  conversationId: string;
  senderId: number;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  attachments?: MessageAttachment[];
  replyToId?: string;
  editedAt?: string;
  deletedAt?: string;
  sender: MessageSender;
  replyTo?: Message;
}

export interface MessageSender {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface ConversationResponse {
  conversations: Conversation[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export interface MessagesResponse {
  messages: Message[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export interface CreateDirectConversationRequest {
  userId: number;
}

export interface CreateGroupConversationRequest {
  name: string;
  userIds: number[];
}

export interface SendMessageRequest {
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'system';
  attachments?: MessageAttachment[];
  replyToId?: string;
}

export interface EditMessageRequest {
  content: string;
}
