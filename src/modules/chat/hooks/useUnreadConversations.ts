import { useQuery, useQueryClient } from '@tanstack/react-query';
import useApi from '@common/hooks/useApi';
import { API_ROUTES } from '../defs/api-routes';
import { useEffect } from 'react';

export const useUnreadConversations = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['unread-conversations'],
    queryFn: async () => {
      // We'll use the conversations endpoint and count unread ones
      const response = await api<{ conversations: any[] }>(API_ROUTES.CHAT.CONVERSATIONS);
      if (response.success && response.data) {
        const unreadCount = response.data.conversations.reduce((total, conversation) => {
          return total + (conversation.unreadCount || 0);
        }, 0);
        return { unreadCount };
      }
      return { unreadCount: 0 };
    },
    staleTime: 10000, // Consider data fresh for 10 seconds
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
  });

  // Listen for real-time chat events to invalidate unread count
  useEffect(() => {
    const handleMessageSent = () => {
      queryClient.invalidateQueries({ queryKey: ['unread-conversations'] });
    };

    const handleMessageReceived = () => {
      queryClient.invalidateQueries({ queryKey: ['unread-conversations'] });
    };

    const handleMessageRead = () => {
      queryClient.invalidateQueries({ queryKey: ['unread-conversations'] });
    };

    // Listen for chat events
    window.addEventListener('chat:message:sent', handleMessageSent);
    window.addEventListener('chat:message:received', handleMessageReceived);
    window.addEventListener('chat:message:read', handleMessageRead);

    return () => {
      window.removeEventListener('chat:message:sent', handleMessageSent);
      window.removeEventListener('chat:message:received', handleMessageReceived);
      window.removeEventListener('chat:message:read', handleMessageRead);
    };
  }, [queryClient]);

  return query;
};
