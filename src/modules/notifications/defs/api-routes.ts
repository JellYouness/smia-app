export const API_ROUTES = {
  NOTIFICATIONS: {
    INDEX: '/notifications',
    SHOW: (id: string) => `/notifications/${id}`,
    MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_AS_READ: '/notifications/mark-all-read',
    DELETE: (id: string) => `/notifications/${id}`,
    TYPES: '/notifications/types',
    UNREAD_COUNT: '/notifications/unread-count',
  },
} as const;
