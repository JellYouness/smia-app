import { useState, useEffect, useCallback } from 'react';
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
  const [data, setData] = useState<NotificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

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

    try {
      const response = await api<NotificationResponse>(url);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.errors?.[0] || 'Failed to load notifications');
      }
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [api, filters.type, filters.read, filters.perPage, filters.page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { data, loading, error, refetch: fetchNotifications };
};

export const useNotification = (id: string) => {
  const api = useApi();
  const [data, setData] = useState<{ data: Notification } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotification = useCallback(async () => {
    if (!id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api<{ data: Notification }>(API_ROUTES.NOTIFICATIONS.SHOW(id));
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.errors?.[0] || 'Failed to load notification');
      }
    } catch (err) {
      setError('Failed to load notification');
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  useEffect(() => {
    fetchNotification();
  }, [fetchNotification]);

  return { data, loading, error, refetch: fetchNotification };
};

export const useNotificationTypes = () => {
  const api = useApi();
  const [data, setData] = useState<{ data: NotificationTypeOption[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api<{ data: NotificationTypeOption[] }>(
        API_ROUTES.NOTIFICATIONS.TYPES
      );
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.errors?.[0] || 'Failed to load notification types');
      }
    } catch (err) {
      setError('Failed to load notification types');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  return { data, loading, error, refetch: fetchTypes };
};

export const useUnreadCount = () => {
  const api = useApi();
  const [data, setData] = useState<{ unreadCount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api<{ unreadCount: number }>(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.errors?.[0] || 'Failed to load unread count');
      }
    } catch (err) {
      setError('Failed to load unread count');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchUnreadCount();

    // Refetch every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return { data, loading, error, refetch: fetchUnreadCount };
};

export const useMarkAsRead = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);

  const markAsRead = async (id: string, onSuccess?: () => void) => {
    setLoading(true);
    try {
      const response = await api(API_ROUTES.NOTIFICATIONS.MARK_AS_READ(id), {
        method: 'PATCH',
        displaySuccess: false,
      });
      if (response.success && onSuccess) {
        onSuccess();
      }
      return response.success;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { markAsRead, loading };
};

export const useMarkAllAsRead = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);

  const markAllAsRead = async (onSuccess?: () => void) => {
    setLoading(true);
    try {
      const response = await api(API_ROUTES.NOTIFICATIONS.MARK_ALL_AS_READ, {
        method: 'PATCH',
        displaySuccess: false,
      });
      if (response.success && onSuccess) {
        onSuccess();
      }
      return response.success;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { markAllAsRead, loading };
};

export const useDeleteNotification = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);

  const deleteNotification = async (id: string, onSuccess?: () => void) => {
    setLoading(true);
    try {
      const response = await api(API_ROUTES.NOTIFICATIONS.DELETE(id), {
        method: 'DELETE',
        displaySuccess: false,
      });
      if (response.success && onSuccess) {
        onSuccess();
      }
      return response.success;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteNotification, loading };
};
