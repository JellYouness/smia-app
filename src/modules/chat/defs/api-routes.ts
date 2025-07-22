export const API_ROUTES = {
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    CREATE_DIRECT: '/chat/conversations/direct',
    CREATE_GROUP: '/chat/conversations/group',
    CREATE_PROJECT: '/chat/conversations/project',
    MESSAGES: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    MARK_AS_READ: (conversationId: string) => `/chat/conversations/${conversationId}/read`,
    EDIT_MESSAGE: (messageId: string) => `/chat/messages/${messageId}`,
    DELETE_MESSAGE: (messageId: string) => `/chat/messages/${messageId}`,
  },
} as const;
