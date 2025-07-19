import { useQuery } from '@tanstack/react-query';
import useApi from '@common/hooks/useApi';
import { API_ROUTES } from '../defs/api-routes';

export const useUnreadConversations = () => {
  const api = useApi();

  return useQuery({
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
    // Refetch every 30 seconds to keep badge updated
    refetchInterval: 30000,
  });
};
