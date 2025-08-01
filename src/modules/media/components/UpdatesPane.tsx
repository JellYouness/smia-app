import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  IconButton,
  Stack,
  Divider,
  Tooltip,
  Fade,
  Grow,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import SendIcon from '@mui/icons-material/Send';
import UpdateIcon from '@mui/icons-material/Update';
import ReportIcon from '@mui/icons-material/Report';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useAuth from '@modules/auth/hooks/api/useAuth';
import useProjectUpdates from '@modules/projects/hooks/useProjectUpdates';
import { PROJECT_UPDATE_TYPE, ProjectUpdate } from '@modules/projects/defs/types';
import { Any } from '@common/defs/types';
import UserAvatar from '@common/components/lib/partials/UserAvatar';
import { User } from '@modules/users/defs/types';

interface UpdatesPaneProps {
  projectId: number;
}

export default function UpdatesPane({ projectId }: UpdatesPaneProps) {
  const { user } = useAuth();
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUpdate, setNewUpdate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Any[]>([]);
  const { readAllByProject, createOne } = useProjectUpdates({ autoRefetchAfterMutation: false });

  // Check if user is a client (can add updates)
  const isClient = user?.userType === 'CLIENT' || user?.client;

  // Fetch updates with optional silent refresh (no loading state)
  const fetchUpdates = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await readAllByProject(projectId, 1, 'all');
      if (res.success && res.data?.items) {
        // Sort updates by creation date, newest first
        const sortedUpdates = res.data.items.sort(
          (a: ProjectUpdate, b: ProjectUpdate) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUpdates(sortedUpdates);
      } else {
        setError('Failed to load updates');
      }
    } catch (e) {
      setError('Failed to load updates');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [projectId]);

  const handleSubmit = async () => {
    if (!newUpdate.trim() || isSubmitting) {
      return;
    }

    const updateText = newUpdate.trim();

    // Create optimistic update with stable ID
    const optimisticUpdate = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      body: updateText,
      type: PROJECT_UPDATE_TYPE.UPDATE,
      createdAt: new Date().toISOString(),
      project: {
        client: {
          user: {
            firstName: user?.firstName || user?.first_name || '',
            lastName: user?.lastName || user?.last_name || '',
            profile: {
              profilePicture: user?.profile?.profilePicture || null,
            },
          },
        },
      },
      isOptimistic: true,
    };

    // Clear input immediately and add optimistic update
    setNewUpdate('');
    setOptimisticUpdates((prev) => [optimisticUpdate, ...prev]);
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await createOne({
        projectId,
        clientId: user?.client?.id,
        body: updateText,
        type: PROJECT_UPDATE_TYPE.UPDATE,
      });

      if (res.success) {
        // Keep optimistic update until we confirm the real update is loaded
        const realUpdate = res.data?.item;
        if (realUpdate) {
          // If we have the real update data, replace the optimistic one
          setUpdates((prev) => {
            const filtered = prev.filter((u) => u.id !== realUpdate.id);
            return [realUpdate, ...filtered];
          });
          setOptimisticUpdates((prev) => prev.filter((u) => u.id !== optimisticUpdate.id));
        } else {
          // If no real update data, fetch updates and then remove optimistic
          await fetchUpdates(true);
          setOptimisticUpdates((prev) => prev.filter((u) => u.id !== optimisticUpdate.id));
        }
      } else {
        // Remove optimistic update on failure
        setOptimisticUpdates((prev) => prev.filter((u) => u.id !== optimisticUpdate.id));
        setError('Failed to post update');
        setNewUpdate(updateText); // Restore text on failure
      }
    } catch (e) {
      // Remove optimistic update on error
      setOptimisticUpdates((prev) => prev.filter((u) => u.id !== optimisticUpdate.id));
      setError('Failed to post update');
      setNewUpdate(updateText); // Restore text on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    }
    if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    }
    if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    }
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUpdateIcon = (type: PROJECT_UPDATE_TYPE) => {
    switch (type) {
      case PROJECT_UPDATE_TYPE.UPDATE:
        return <UpdateIcon fontSize="small" />;
      case PROJECT_UPDATE_TYPE.REPORT_REQUEST:
        return <ReportIcon fontSize="small" />;
      default:
        return <UpdateIcon fontSize="small" />;
    }
  };

  const getUpdateColor = (type: PROJECT_UPDATE_TYPE) => {
    switch (type) {
      case PROJECT_UPDATE_TYPE.UPDATE:
        return 'primary';
      case PROJECT_UPDATE_TYPE.REPORT_REQUEST:
        return 'warning';
      default:
        return 'default';
    }
  };

  const UpdateCard = useCallback(
    ({ update, isOptimistic = false }: { update: ProjectUpdate; isOptimistic?: boolean }) => {
      let userObj: Any = {};

      if (isOptimistic) {
        userObj =
          update.project?.client?.user ||
          update.project?.ambassador?.user ||
          update.project?.client ||
          update.project?.ambassador ||
          {};
      } else {
        userObj = {
          firstName: user?.firstName || user?.first_name || '',
          lastName: user?.lastName || user?.last_name || '',
          email: user?.email || '',
          color: user?.color || '#84cc16',
          profile: {
            profilePicture: user?.profile?.profilePicture || null,
          },
        };
      }

      const normalizedUser = {
        firstName: userObj.firstName || userObj.first_name || '',
        lastName: userObj.lastName || userObj.last_name || '',
        email: userObj.email || '',
        color: userObj.color || '#84cc16',
        profile: {
          profilePicture: userObj.profile?.profilePicture || null,
        },
      } as unknown as User;

      const firstName = normalizedUser.firstName;
      const lastName = normalizedUser.lastName;
      const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown User';

      return (
        <Grow in timeout={500} style={{ transformOrigin: 'top center' }}>
          <Card
            sx={{
              mb: 2,
              background: isOptimistic ? 'rgba(32, 101, 209, 0.05)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: isOptimistic
                ? '1px solid rgba(32, 101, 209, 0.2)'
                : '1px solid rgba(32, 101, 209, 0.08)',
              borderRadius: 2,
              transition: 'all 0.3s ease-in-out',
              opacity: isOptimistic ? 0.8 : 1,
              transform: isOptimistic ? 'scale(0.99)' : 'scale(1)',
              '&:hover': {
                transform: isOptimistic ? 'scale(0.99) translateY(-1px)' : 'translateY(-1px)',
                boxShadow: (theme) => theme.customShadows.z4,
                borderColor: 'primary.light',
              },
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              {/* Header */}
              <Box display="flex" alignItems="flex-start" mb={1.5} gap={1.5}>
                <UserAvatar user={normalizedUser as unknown as User} size="medium" />
                <Box flex={1} minWidth={0}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="text.primary"
                      fontSize="0.85rem"
                      sx={{ flex: 1, minWidth: 0 }}
                    >
                      {fullName}
                    </Typography>
                    <Tooltip
                      title={
                        update.type === PROJECT_UPDATE_TYPE.UPDATE ? 'Update' : 'Report Request'
                      }
                      arrow
                      placement="top"
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ml: 1,
                          color: `${getUpdateColor(update.type)}.main`,
                        }}
                      >
                        {getUpdateIcon(update.type)}
                      </Box>
                    </Tooltip>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                      {formatTimeAgo(update.createdAt)}
                      {isOptimistic && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ ml: 1, fontStyle: 'italic', opacity: 0.7 }}
                        >
                          (sending...)
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Content */}
              <Typography variant="body2" color="text.primary" fontSize="0.8rem" lineHeight={1.5}>
                {update.body}
              </Typography>
            </CardContent>
          </Card>
        </Grow>
      );
    },
    []
  );

  // Combine optimistic updates with real updates
  const allUpdates = [...optimisticUpdates, ...updates];

  return (
    <Box
      sx={{
        height: '100%',
        p: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box mb={2}>
        <Typography variant="h6" fontWeight={700} color="text.primary" mb={0.5} textAlign="center">
          {isClient
            ? 'Share updates and communicate with your team'
            : 'Stay informed about project progress'}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2, borderColor: 'rgba(32, 101, 209, 0.1)' }} />

      {/* Updates Timeline */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          pr: 1,
          pt: 1,
          mb: isClient ? 2 : 0,
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(32, 101, 209, 0.1)',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(32, 101, 209, 0.3)',
            borderRadius: 3,
            '&:hover': {
              backgroundColor: 'rgba(32, 101, 209, 0.5)',
            },
          },
        }}
      >
        {loading && (
          <Fade in timeout={300}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="200px"
              color="text.secondary"
            >
              <Typography variant="body2" textAlign="center">
                Loading updates...
              </Typography>
            </Box>
          </Fade>
        )}
        {!loading && error && (
          <Fade in timeout={300}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="200px"
              color="text.secondary"
            >
              <Typography variant="body2" textAlign="center" color="error">
                {error}
              </Typography>
            </Box>
          </Fade>
        )}
        {!loading && !error && allUpdates.length === 0 ? (
          <Fade in timeout={300}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="200px"
              color="text.secondary"
            >
              <UpdateIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
              <Typography variant="body2" textAlign="center">
                No updates yet
              </Typography>
              {isClient && (
                <Typography variant="caption" textAlign="center" mt={0.5}>
                  Be the first to share an update!
                </Typography>
              )}
            </Box>
          </Fade>
        ) : (
          <Stack spacing={0}>
            {(() => {
              const groupedUpdates: { [key: string]: any[] } = {};

              // Group updates by date
              allUpdates.forEach((update) => {
                const dateKey = new Date(update.createdAt).toDateString();
                if (!groupedUpdates[dateKey]) {
                  groupedUpdates[dateKey] = [];
                }
                groupedUpdates[dateKey].push(update);
              });

              // Sort dates and render updates with date separators
              const sortedDates = Object.keys(groupedUpdates).sort(
                (a, b) => new Date(b).getTime() - new Date(a).getTime()
              );

              return sortedDates.map((dateKey, dateIndex) => (
                <Box key={dateKey}>
                  {/* Date Separator */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      my: 2,
                      position: 'relative',
                    }}
                  >
                    <Chip
                      label={formatDate(dateKey)}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(32, 101, 209, 0.1)',
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: '24px',
                        border: '1px solid rgba(32, 101, 209, 0.2)',
                        '& .MuiChip-label': {
                          px: 2,
                        },
                      }}
                    />
                  </Box>

                  {/* Updates for this date */}
                  {groupedUpdates[dateKey].map((update) => (
                    <UpdateCard
                      key={`${update.id}-${update.isOptimistic ? 'optimistic' : 'real'}`}
                      update={update}
                      isOptimistic={update.isOptimistic}
                    />
                  ))}
                </Box>
              ));
            })()}
          </Stack>
        )}
      </Box>

      {/* Add Update Input (Only for Clients) */}
      {isClient && (
        <Fade in timeout={300}>
          <Box>
            <Card
              sx={{
                background: 'rgba(32, 101, 209, 0.03)',
                border: '1px solid rgba(32, 101, 209, 0.1)',
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'rgba(32, 101, 209, 0.2)',
                },
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Share an update with your team..."
                  value={newUpdate}
                  onChange={(e) => setNewUpdate(e.target.value)}
                  onKeyDown={handleKeyPress}
                  variant="outlined"
                  disabled={isSubmitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease-in-out',
                      '& fieldset': { borderColor: 'rgba(32, 101, 209, 0.2)' },
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    },
                  }}
                />
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    Press Ctrl+Enter to send
                  </Typography>
                  <IconButton
                    onClick={handleSubmit}
                    disabled={!newUpdate.trim() || isSubmitting}
                    size="small"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        transform: 'scale(1.05)',
                      },
                      '&:disabled': {
                        backgroundColor: 'action.disabled',
                        transform: 'scale(1)',
                      },
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      )}
    </Box>
  );
}
