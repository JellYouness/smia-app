import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  IconButton,
  Badge,
  CircularProgress,
} from '@mui/material';
import { Send, MoreVert, Search } from '@mui/icons-material';
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '../hooks/useChat';
import { useChat } from '../contexts/ChatContext';
import {
  Conversation,
  ConversationResponse,
  Message,
  MessagesResponse,
  Participant,
} from '../defs/types';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import UserAvatar from '@common/components/lib/partials/UserAvatar';
import { User } from '@modules/users/defs/types';

interface ChatWindowProps {
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  onProjectPage?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedConversationId,
  onConversationSelect,
  onProjectPage = false,
}) => {
  const { t } = useTranslation(['common', 'chat']);
  const { user } = useAuth();
  const { subscribeToConversation, unsubscribeFromConversation } = useChat();
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations();
  const { data: messagesData, isLoading: messagesLoading } = useMessages(
    selectedConversationId || ''
  );

  // Type-safe data access
  const conversations = useMemo(() => {
    return (conversationsData as ConversationResponse)?.conversations || [];
  }, [conversationsData]);

  const messages = useMemo(() => {
    return (messagesData as MessagesResponse)?.messages || [];
  }, [messagesData]);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const queryClient = useQueryClient();

  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const [isSelectingConversation, setIsSelectingConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time updates for selected conversation
  useEffect(() => {
    if (selectedConversationId) {
      subscribeToConversation(selectedConversationId);
    }

    return () => {
      if (selectedConversationId) {
        unsubscribeFromConversation(selectedConversationId);
      }
    };
  }, [selectedConversationId, subscribeToConversation, unsubscribeFromConversation]);

  // Mark as read when conversation is selected (separate effect to avoid infinite loops)
  useEffect(() => {
    if (selectedConversationId) {
      markAsReadMutation.mutate(selectedConversationId);
    }
  }, [selectedConversationId]);

  // Removed auto-selection of first conversation - let user choose manually

  // Scroll to bottom of messages container
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.closest('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, []);

  // Auto-scroll to bottom when messages change or conversation changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversationId, scrollToBottom]);

  // Debounce search term
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Listen for real-time message events
  useEffect(() => {
    const handleMessageSent = (event: CustomEvent) => {
      // Invalidate conversations to update latest message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      // If this is for the current conversation, also invalidate messages
      if (event.detail.conversationId === selectedConversationId) {
        queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] });
      }
    };

    const handleMessageEdited = (event: CustomEvent) => {
      // Invalidate conversations to update latest message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      // If this is for the current conversation, also invalidate messages
      if (event.detail.conversationId === selectedConversationId) {
        queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] });
      }
    };

    const handleMessageDeleted = (event: CustomEvent) => {
      // Invalidate conversations to update latest message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      // If this is for the current conversation, also invalidate messages
      if (event.detail.conversationId === selectedConversationId) {
        queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] });
      }
    };

    window.addEventListener('chat:message:sent', handleMessageSent as EventListener);
    window.addEventListener('chat:message:edited', handleMessageEdited as EventListener);
    window.addEventListener('chat:message:deleted', handleMessageDeleted as EventListener);

    return () => {
      window.removeEventListener('chat:message:sent', handleMessageSent as EventListener);
      window.removeEventListener('chat:message:edited', handleMessageEdited as EventListener);
      window.removeEventListener('chat:message:deleted', handleMessageDeleted as EventListener);
    };
  }, [queryClient, selectedConversationId]);

  const handleSendMessage = useCallback(() => {
    if (!messageText.trim() || !selectedConversationId) {
      return;
    }

    sendMessageMutation.mutate({
      conversationId: selectedConversationId,
      data: { content: messageText.trim() },
    });

    setMessageText('');
  }, [messageText, selectedConversationId, sendMessageMutation]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleConversationSelect = useCallback(
    (conversationId: string) => {
      setIsSelectingConversation(true);
      onConversationSelect(conversationId);
      // Reset loading state after a short delay
      setTimeout(() => setIsSelectingConversation(false), 500);
    },
    [onConversationSelect]
  );

  const filteredConversations = useMemo(() => {
    if (!Array.isArray(conversations)) {
      return [];
    }

    return conversations.filter(
      (conversation: Conversation) =>
        conversation.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        conversation.participants.some((participant: Participant) =>
          `${participant.firstName} ${participant.lastName}`
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
        )
    );
  }, [conversations, debouncedSearchTerm]);

  const selectedConversation: Conversation | undefined = useMemo(() => {
    if (!Array.isArray(conversations) || !selectedConversationId) {
      return undefined;
    }

    return conversations.find(
      (conv: Conversation) => conv.id.toString() === selectedConversationId
    );
  }, [conversations, selectedConversationId]);

  const getConversationDisplayName = useCallback(
    (conversation: Conversation) => {
      if (conversation.name) {
        return conversation.name;
      }

      const otherParticipants = conversation.participants.filter(
        (participant) => participant.id !== user?.id
      );

      if (conversation.type === 'direct' && otherParticipants.length === 1) {
        const participant = otherParticipants[0];
        return `${participant.firstName} ${participant.lastName}`;
      }

      return otherParticipants.map((p) => `${p.firstName} ${p.lastName}`).join(', ');
    },
    [user?.id]
  );

  const getConversationAvatar = useCallback(
    (conversation: Conversation) => {
      if (conversation.type === 'direct') {
        const otherParticipant = conversation.participants.find((p) => p.id !== user?.id);
        return otherParticipant?.profilePicture || otherParticipant?.firstName?.[0] || '?';
      }

      return conversation.name?.[0] || 'G';
    },
    [user?.id]
  );

  const renderConversationsList = useCallback(() => {
    if (conversationsLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, flexShrink: 0 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (filteredConversations.length === 0) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            textAlign: 'center',
            flex: 1,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h4" color="grey.400">
              💬
            </Typography>
          </Box>
          <Typography variant="body1" color="text.primary" gutterBottom>
            {t('chat:no_conversations')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('chat:no_conversations_description')}
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ p: 0, flex: 1, overflow: 'auto' }}>
        {filteredConversations.map((conversation: Conversation) => (
          <ListItem
            key={conversation.id}
            button
            selected={conversation.id.toString() === selectedConversationId}
            onClick={() => handleConversationSelect(conversation.id.toString())}
            disabled={isSelectingConversation}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: conversation.unreadCount ? 'action.hover' : 'transparent',
              '&:hover': {
                backgroundColor: conversation.unreadCount ? 'action.selected' : 'action.hover',
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemAvatar>
              <Badge
                badgeContent={conversation.unreadCount || 0}
                color="primary"
                invisible={!conversation.unreadCount}
              >
                {/* <Avatar>{getConversationAvatar(conversation)}</Avatar> */}
                <UserAvatar
                  user={conversation.participants.find((p) => p.id !== user?.id) as unknown as User}
                  size="large"
                />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={getConversationDisplayName(conversation)}
              secondary={conversation.latestMessage?.content || t('chat:no_messages')}
              primaryTypographyProps={{
                fontWeight: conversation.unreadCount ? 'bold' : 'normal',
              }}
              secondaryTypographyProps={{
                fontWeight: conversation.unreadCount ? 'bold' : 'normal',
                color:
                  conversation === selectedConversation ? 'primary.contrastText' : 'text.secondary',
              }}
            />
            <IconButton size="small">
              <MoreVert
                sx={{
                  color:
                    conversation === selectedConversation
                      ? 'primary.contrastText'
                      : 'text.secondary',
                }}
                color={conversation === selectedConversation ? 'secondary' : 'primary'}
              />
            </IconButton>
          </ListItem>
        ))}
      </List>
    );
  }, [
    conversationsLoading,
    filteredConversations,
    selectedConversationId,
    isSelectingConversation,
    handleConversationSelect,
    getConversationAvatar,
    getConversationDisplayName,
    selectedConversation,
    t,
  ]);

  return (
    <Grid container sx={{ height: '80vh', overflow: 'hidden', bgcolor: 'white' }}>
      {/* Conversations List */}
      {!onProjectPage && (
        <Grid
          item
          xs={4}
          sx={{
            borderRight: 1,
            borderLeft: 1,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box sx={{ p: 2, flexShrink: 0 }}>
            <Typography variant="h6" gutterBottom>
              {t('chat:conversations')}
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder={t('chat:search_conversations')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ mb: 2 }}
            />
          </Box>

          {renderConversationsList()}
        </Grid>
      )}

      {/* Messages Area */}
      <Grid
        item
        xs={onProjectPage ? 12 : 8}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderBottom: 1,
          borderRight: 1,
          borderColor: 'divider',
        }}
      >
        {selectedConversationId ? (
          <>
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {selectedConversation ? (
                <>
                  {/* <Avatar>{getConversationAvatar(selectedConversation)}</Avatar> */}
                  <UserAvatar
                    user={
                      selectedConversation.participants.find(
                        (p) => p.id !== user?.id
                      ) as unknown as User
                    }
                    size="medium"
                  />
                  <Typography variant="h6">
                    {getConversationDisplayName(selectedConversation)}
                  </Typography>
                </>
              ) : (
                <>
                  <Avatar>?</Avatar>
                  <Typography variant="h6">{t('chat:loading')}</Typography>
                </>
              )}
            </Box>

            {/* Messages */}
            <Box
              className="messages-container"
              sx={{ flex: 1, overflow: 'auto', p: 2, minHeight: 0 }}
            >
              {messagesLoading || isSelectingConversation ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((message: Message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwnMessage={message.senderId === user?.id}
                        isTypeProject={selectedConversation?.type === 'project'}
                      />
                    ))
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('chat:no_messages')}
                      </Typography>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>
              )}
            </Box>

            {/* Message Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder={t('chat:type_message')}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sendMessageMutation.isPending || isSelectingConversation}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={
                    !messageText.trim() || sendMessageMutation.isPending || isSelectingConversation
                  }
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h2" color="grey.400">
                💬
              </Typography>
            </Box>
            <Typography variant="h5" color="text.primary" gutterBottom>
              {t('chat:no_conversation_selected')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
              {t('chat:select_conversation_description')}
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  isTypeProject?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, isTypeProject }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      <Paper
        sx={{
          p: 1.5,
          maxWidth: '70%',
          backgroundColor: isOwnMessage ? 'primary.main' : 'grey.100',
          color: isOwnMessage ? 'white' : 'text.primary',
        }}
      >
        {!isOwnMessage && isTypeProject && (
          <Typography
            variant="caption"
            color="primary.main"
            sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}
          >
            {message.sender.firstName} {message.sender.lastName}
          </Typography>
        )}
        <Typography variant="body2">{message.content}</Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Paper>
    </Box>
  );
};
