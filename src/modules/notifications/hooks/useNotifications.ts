import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@common/hooks/useApi';
import { API_ROUTES } from '../defs/api-routes';
import {
  Notification,
  NotificationFilters,
  NotificationResponse,
  NotificationTypeOption,
} from '../defs/types';

export const useNotifications = (filters: NotificationFilters = {}) => {
  const api = useApi();

  return useQuery({
    queryKey: ['notifications', filters.type, filters.read, filters.perPage, filters.page],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (filters.type) {
        queryParams.append('type', filters.type);
      }
      if (filters.read !== undefined) {
        queryParams.append('read', filters.read.toString());
      }
      if (filters.perPage) {
        queryParams.append('per_page', filters.perPage.toString());
      }
      if (filters.page) {
        queryParams.append('page', filters.page.toString());
      }

      const url = `${API_ROUTES.NOTIFICATIONS.INDEX}?${queryParams.toString()}`;

      const response = await api<NotificationResponse>(url);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.errors?.[0] || 'Failed to load notifications');
    },
    staleTime: 10000, // Consider data fresh for 10 seconds
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
  });
};

export const useNotification = (id: string) => {
  const api = useApi();

  return useQuery({
    queryKey: ['notification', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Notification ID is required');
      }

      const response = await api<{ data: Notification }>(API_ROUTES.NOTIFICATIONS.SHOW(id));
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.errors?.[0] || 'Failed to load notification');
    },
    enabled: !!id,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};

export const useNotificationTypes = () => {
  const api = useApi();

  return useQuery({
    queryKey: ['notification-types'],
    queryFn: async () => {
      const response = await api<{ data: NotificationTypeOption[] }>(
        API_ROUTES.NOTIFICATIONS.TYPES
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.errors?.[0] || 'Failed to load notification types');
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

export const useUnreadCount = () => {
  const api = useApi();

  return useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const response = await api<{ unreadCount: number }>(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.errors?.[0] || 'Failed to load unread count');
    },
    staleTime: 10000, // Consider data fresh for 10 seconds
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api(API_ROUTES.NOTIFICATIONS.MARK_AS_READ(id), {
        method: 'PATCH',
        displaySuccess: false,
      });
      if (!response.success) {
        throw new Error('Failed to mark notification as read');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate notifications and unread count
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api(API_ROUTES.NOTIFICATIONS.MARK_ALL_AS_READ, {
        method: 'PATCH',
        displaySuccess: false,
      });
      if (!response.success) {
        throw new Error('Failed to mark all notifications as read');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate notifications and unread count
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
};

export const useDeleteNotification = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api(API_ROUTES.NOTIFICATIONS.DELETE(id), {
        method: 'DELETE',
        displaySuccess: false,
      });
      if (!response.success) {
        throw new Error('Failed to delete notification');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate notifications and unread count
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
};
