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
} from '@mui/material';
import { useState, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import UpdateIcon from '@mui/icons-material/Update';
import ReportIcon from '@mui/icons-material/Report';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { PROJECT_UPDATE_TYPE } from '../defs/types';
import useProjectUpdates from '../hooks/useProjectUpdates';

interface UpdatesPaneProps {
  projectId: number;
}

export default function UpdatesPane({ projectId }: UpdatesPaneProps) {
  const { user } = useAuth();
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUpdate, setNewUpdate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { readAllByProject, createOne } = useProjectUpdates();

  // Check if user is a client (can add updates)
  const isClient = user?.userType === 'CLIENT' || user?.client;

  // Fetch updates on mount and after posting
  const fetchUpdates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await readAllByProject(projectId, 1, 'all');
      if (res.success && res.data?.items) {
        setUpdates(res.data.items);
      } else {
        setError('Failed to load updates');
      }
    } catch (e) {
      setError('Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [projectId]);

  const handleSubmit = async () => {
    if (!newUpdate.trim() || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await createOne({
        projectId,
        clientId: user?.client?.id,
        body: newUpdate,
        type: PROJECT_UPDATE_TYPE.UPDATE,
      });
      if (res.success) {
        setNewUpdate('');
        await fetchUpdates();
      } else {
        setError('Failed to post update');
      }
    } catch (e) {
      setError('Failed to post update');
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

  const UpdateCard = ({ update }: { update: any }) => {
    // Prefer user info from client.user or ambassador.user
    const userObj =
      update.project?.client?.user ||
      update.project?.ambassador?.user ||
      update.project?.client ||
      update.project?.ambassador ||
      {};
    const firstName = userObj.firstName || userObj.first_name || '';
    const lastName = userObj.lastName || userObj.last_name || '';
    const initials = (firstName?.[0] || '') + (lastName?.[0] || '');
    const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown User';
    const profileImage =
      userObj.profileImage || userObj.profile_image || userObj.profile?.profile_picture || null;

    return (
      <Card
        sx={{
          mb: 2,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(32, 101, 209, 0.08)',
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: (theme) => theme.customShadows.z4,
            borderColor: 'primary.light',
          },
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header */}
          <Box display="flex" alignItems="center" mb={1.5}>
            <Avatar
              src={profileImage || undefined}
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.75rem',
                backgroundColor: 'primary.main',
                color: 'white',
                mr: 1.5,
              }}
            >
              {profileImage ? null : initials || 'U'}
            </Avatar>
            <Box flex={1}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.primary"
                fontSize="0.85rem"
              >
                {fullName}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                  {formatTimeAgo(update.createdAt)}
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={getUpdateIcon(update.type)}
              label={update.type === PROJECT_UPDATE_TYPE.UPDATE ? 'Update' : 'Report Request'}
              size="small"
              color={getUpdateColor(update.type) as any}
              sx={{
                height: 24,
                fontSize: '0.7rem',
                '& .MuiChip-icon': { fontSize: 14 },
              }}
            />
          </Box>

          {/* Content */}
          <Typography variant="body2" color="text.primary" fontSize="0.8rem" lineHeight={1.5}>
            {update.body}
          </Typography>
        </CardContent>
      </Card>
    );
  };

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
      {/* Header (now with subtitle as main text) */}
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
        )}
        {!loading && error && (
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
        )}
        {!loading && !error && updates.length === 0 ? (
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
        ) : (
          <Stack spacing={0}>
            {updates.map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </Stack>
        )}
      </Box>

      {/* Add Update Input (Only for Clients) - Now at bottom */}
      {isClient && (
        <Box>
          <Card
            sx={{
              background: 'rgba(32, 101, 209, 0.03)',
              border: '1px solid rgba(32, 101, 209, 0.1)',
              borderRadius: 2,
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.85rem',
                    '& fieldset': { borderColor: 'rgba(32, 101, 209, 0.2)' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
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
                    '&:hover': { backgroundColor: 'primary.dark' },
                    '&:disabled': { backgroundColor: 'action.disabled' },
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
