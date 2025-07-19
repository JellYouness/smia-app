import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import Pusher from 'pusher-js';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { Message } from '../defs/types';

interface ChatContextType {
  isConnected: boolean;
  subscribeToConversation: (conversationId: string) => void;
  unsubscribeFromConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, message: Message) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [channels, setChannels] = useState<Map<string, { channel: any; handlers: any }>>(new Map());

  useEffect(() => {
    if (!user) {
      return;
    }

    // Initialize Pusher
    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },
    });

    pusherInstance.connection.bind('connected', () => {
      setIsConnected(true);
    });

    pusherInstance.connection.bind('disconnected', () => {
      setIsConnected(false);
    });

    setPusher(pusherInstance);

    return () => {
      pusherInstance.disconnect();
    };
  }, [user]);

  const subscribeToConversation = useCallback(
    (conversationId: string) => {
      if (!pusher || channels.has(conversationId)) {
        return;
      }

      const channel = pusher.subscribe(`private-conversation.${conversationId}`);

      const handleMessageSent = (data: { message: Message }) => {
        window.dispatchEvent(
          new CustomEvent('chat:message:sent', {
            detail: { conversationId, message: data.message },
          })
        );
      };

      const handleMessageEdited = (data: { message: Message }) => {
        window.dispatchEvent(
          new CustomEvent('chat:message:edited', {
            detail: { conversationId, message: data.message },
          })
        );
      };

      const handleMessageDeleted = (data: { message_id: string }) => {
        window.dispatchEvent(
          new CustomEvent('chat:message:deleted', {
            detail: { conversationId, messageId: data.message_id },
          })
        );
      };

      channel.bind('message.sent', handleMessageSent);
      channel.bind('message.edited', handleMessageEdited);
      channel.bind('message.deleted', handleMessageDeleted);

      // Store channel with event handlers for cleanup
      setChannels((prev) =>
        new Map(prev).set(conversationId, {
          channel,
          handlers: { handleMessageSent, handleMessageEdited, handleMessageDeleted },
        })
      );
    },
    [pusher, channels]
  );

  const unsubscribeFromConversation = useCallback(
    (conversationId: string) => {
      const channelData = channels.get(conversationId);
      if (channelData && pusher) {
        const { channel, handlers } = channelData;

        // Unbind event handlers to prevent memory leaks
        channel.unbind('message.sent', handlers.handleMessageSent);
        channel.unbind('message.edited', handlers.handleMessageEdited);
        channel.unbind('message.deleted', handlers.handleMessageDeleted);

        pusher.unsubscribe(`private-conversation.${conversationId}`);
        setChannels((prev) => {
          const newChannels = new Map(prev);
          newChannels.delete(conversationId);
          return newChannels;
        });
      }
    },
    [pusher, channels]
  );

  const sendMessage = useCallback((conversationId: string, message: Message) => {
    // This is handled by the API, but you can add optimistic updates here
    window.dispatchEvent(
      new CustomEvent('chat:message:optimistic', {
        detail: { conversationId, message },
      })
    );
  }, []);

  const value: ChatContextType = useMemo(
    () => ({
      isConnected,
      subscribeToConversation,
      unsubscribeFromConversation,
      sendMessage,
    }),
    [isConnected, subscribeToConversation, unsubscribeFromConversation, sendMessage]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
