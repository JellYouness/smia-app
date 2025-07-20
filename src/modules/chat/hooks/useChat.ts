import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@common/hooks/useApi';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { API_ROUTES } from '../defs/api-routes';
import {
  Conversation,
  Message,
  ConversationResponse,
  MessagesResponse,
  CreateDirectConversationRequest,
  CreateGroupConversationRequest,
  SendMessageRequest,
  EditMessageRequest,
} from '../defs/types';

export const useConversations = (perPage = 20) => {
  const api = useApi();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversations', perPage],
    queryFn: async () => {
      const response = await api<ConversationResponse>(
        `${API_ROUTES.CHAT.CONVERSATIONS}?per_page=${perPage}`
      );
      return response.data;
    },
    enabled: !!user, // Only run when user is authenticated
    staleTime: 10000, // Consider data fresh for 10 seconds
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
  });
};

export const useMessages = (conversationId: string, beforeMessageId?: string, perPage = 50) => {
  const api = useApi();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['messages', conversationId, perPage, beforeMessageId],
    queryFn: async () => {
      let url = `${API_ROUTES.CHAT.MESSAGES(conversationId)}?per_page=${perPage}`;
      if (beforeMessageId) {
        url += `&before_message_id=${beforeMessageId}`;
      }
      const response = await api<MessagesResponse>(url);
      return response.data;
    },
    enabled: !!conversationId && !!user, // Only run when conversationId exists and user is authenticated
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};

export const useSendMessage = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      data,
    }: {
      conversationId: string;
      data: SendMessageRequest;
    }) => {
      const response = await api<Message>(API_ROUTES.CHAT.MESSAGES(conversationId), {
        method: 'POST',
        data,
      });
      return response.data;
    },
    onSuccess: (message, { conversationId }) => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      // Invalidate conversations to update latest message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useCreateDirectConversation = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDirectConversationRequest) => {
      const response = await api<Conversation>(API_ROUTES.CHAT.CREATE_DIRECT, {
        method: 'POST',
        data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useCreateGroupConversation = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGroupConversationRequest) => {
      const response = await api<Conversation>(API_ROUTES.CHAT.CREATE_GROUP, {
        method: 'POST',
        data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useEditMessage = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, data }: { messageId: string; data: EditMessageRequest }) => {
      const response = await api<Message>(API_ROUTES.CHAT.EDIT_MESSAGE(messageId), {
        method: 'PUT',
        data,
      });
      return response.data;
    },
    onSuccess: (message) => {
      // Invalidate messages for this conversation
      if (message?.conversationId) {
        queryClient.invalidateQueries({ queryKey: ['messages', message.conversationId] });
      }
    },
  });
};

export const useDeleteMessage = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      conversationId,
    }: {
      messageId: string;
      conversationId: string;
    }) => {
      await api(API_ROUTES.CHAT.DELETE_MESSAGE(messageId), {
        method: 'DELETE',
      });
      return { messageId, conversationId };
    },
    onSuccess: ({ conversationId }) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });
};

export const useMarkAsRead = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      await api(API_ROUTES.CHAT.MARK_AS_READ(conversationId), {
        method: 'PUT',
      });
      return conversationId;
    },
    onSuccess: (conversationId) => {
      // Invalidate conversations to update unread counts
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });
};
