import useCreators from '@modules/creators/hooks/useCreators';
import { Creator } from '@modules/creators/defs/types';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Rating,
  Button,
  Skeleton,
  useTheme,
  Stack,
  Divider,
  Fade,
  Slide,
  Zoom,
  IconButton,
  Tooltip,
  Badge,
  alpha,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Check,
  Done,
  Star,
  PersonOffOutlined,
  LocationOn,
  Verified,
  TrendingUp,
  Schedule,
  AttachMoney,
  Language as LanguageIcon,
  WorkOutline,
  EmojiEvents,
  Visibility,
} from '@mui/icons-material';
import LanguageChips from '../LanguageChips';
import useProjects, { projectCacheKey } from '@modules/projects/hooks/useProjects';
import { Id } from '@common/defs/types';
import { FilterParam } from '@common/hooks/useItems';
import {
  Project,
  PROJECT_INVITE_FILTER,
  PROJECT_INVITE_STATUS,
} from '@modules/projects/defs/types';
import InviteMessageModal from '../InviteMessageModal';
import Routes from '@common/defs/routes';
import StepperEmptyState from '../StepperEmptyState';
import { useSWRConfig } from 'swr';
import { User } from '@modules/users/defs/types';
import UserAvatar from '@common/components/lib/partials/UserAvatar';

interface InviteCreatorsStepProps {
  projectId: Id;
  project: Project;
}

const InviteCreatorsStep = ({ projectId, project }: InviteCreatorsStepProps) => {
  const { t } = useTranslation(['project', 'common', 'user']);
  const theme = useTheme();
  const { readAll } = useCreators();
  const { inviteCreator } = useProjects();
  const { mutate } = useSWRConfig();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteMessageModalOpen, setInviteMessageModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [hoveredCard, setHoveredCard] = useState<Id | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [invitingCreatorId, setInvitingCreatorId] = useState<Id | null>(null);

  useEffect(() => {
    fetchCreators();
  }, [activeTab]);

  const fetchCreators = async () => {
    setLoading(true);

    // Create filters based on active tab
    const filters: FilterParam[] = [];

    if (activeTab === 1) {
      filters.push({
        filterColumn: 'project_invite_status',
        filterOperator: 'equals',
        filterValue: {
          status: PROJECT_INVITE_FILTER.UNINVITED,
          projectId,
        },
      });
    } else if (activeTab === 2) {
      filters.push({
        filterColumn: 'project_invite_status',
        filterOperator: 'equals',
        filterValue: {
          status: PROJECT_INVITE_FILTER.PENDING,
          projectId,
        },
      });
    } else if (activeTab === 3) {
      filters.push({
        filterColumn: 'project_invite_status',
        filterOperator: 'equals',
        filterValue: {
          status: PROJECT_INVITE_FILTER.ACCEPTED,
          projectId,
        },
      });
    } else if (activeTab === 4) {
      filters.push({
        filterColumn: 'project_invite_status',
        filterOperator: 'equals',
        filterValue: {
          status: PROJECT_INVITE_FILTER.DECLINED,
          projectId,
        },
      });
    }

    const response = await readAll(1, 'all', undefined, filters);
    if (response.success && response.data) {
      const parsedCreators = response.data.items.map((creator) => ({
        ...creator,
        skills: typeof creator.skills === 'string' ? JSON.parse(creator.skills) : creator.skills,
        languages:
          typeof creator.languages === 'string' ? JSON.parse(creator.languages) : creator.languages,
        regionalExpertise:
          typeof creator.regionalExpertise === 'string'
            ? JSON.parse(creator.regionalExpertise)
            : creator.regionalExpertise,
      }));

      // Filter out creators who are already hired in this project
      const hiredCreatorIds = project?.projectCreators?.map((pc) => pc.creatorId) || [];
      const availableCreators = parsedCreators.filter(
        (creator) => !hiredCreatorIds.includes(creator.id)
      );

      setCreators(availableCreators);
    }
    setLoading(false);
  };

  const handleInvite = async (creatorId: Id, message: string) => {
    setInvitingCreatorId(creatorId);
    try {
      const response = await inviteCreator({
        projectId,
        creatorId,
        message,
      });
      if (response.success) {
        setInviteMessageModalOpen(false);
        await mutate(projectCacheKey(projectId));
      }
    } catch (error) {
      console.error('Error inviting creator:', error);
    } finally {
      setInvitingCreatorId(null);
    }
  };

  const handleViewProfile = (creatorId: Id) => {
    window.open(Routes.Creators.ReadOne.replace('{id}', creatorId.toString()), '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return { main: '#10b981', bg: alpha('#10b981', 0.1), text: '#065f46' };
      case 'BUSY':
        return { main: '#f59e0b', bg: alpha('#f59e0b', 0.1), text: '#92400e' };
      case 'LIMITED':
        return { main: '#3b82f6', bg: alpha('#3b82f6', 0.1), text: '#1e40af' };
      default:
        return { main: '#ef4444', bg: alpha('#ef4444', 0.1), text: '#dc2626' };
    }
  };

  const getVerificationConfig = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return {
          icon: <Verified fontSize="small" />,
          color: '#10b981',
          bg: alpha('#10b981', 0.1),
          label: 'Verified Creator',
        };
      case 'FEATURED':
        return {
          icon: <EmojiEvents fontSize="small" />,
          color: '#f59e0b',
          bg: alpha('#f59e0b', 0.1),
          label: 'Featured Creator',
        };
      default:
        return null;
    }
  };

  const renderEnhancedSkeleton = () => (
    <Box>
      {[1, 2, 3, 4].map((item, index) => (
        <Fade in timeout={300 + index * 100} key={item}>
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="flex-start" mb={3}>
                <Box position="relative">
                  <Skeleton variant="circular" width={64} height={64} />
                  <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    sx={{ position: 'absolute', top: -2, right: -2 }}
                  />
                </Box>
                <Box ml={3} flexGrow={1}>
                  <Skeleton width="40%" height={28} sx={{ mb: 1 }} />
                  <Skeleton width="60%" height={20} sx={{ mb: 2 }} />
                  <Box display="flex" gap={1}>
                    <Skeleton width={80} height={24} sx={{ borderRadius: 12 }} />
                    <Skeleton width={100} height={24} sx={{ borderRadius: 12 }} />
                  </Box>
                </Box>
                <Skeleton width={120} height={40} sx={{ borderRadius: 2 }} />
              </Box>

              <Box display="flex" gap={4} mb={2}>
                <Skeleton width={80} height={20} />
                <Skeleton width={120} height={20} />
              </Box>

              <Box display="flex" gap={1} flexWrap="wrap">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} width={80} height={28} sx={{ borderRadius: 14 }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Fade>
      ))}
    </Box>
  );

  const renderCreatorCard = (creator: Creator, index: number) => {
    const invite = project?.invites?.find((inv) => inv.creatorId === creator.id);
    const statusColors = getStatusColor(creator.availability);
    const verificationConfig = getVerificationConfig(creator.verificationStatus);

    // Determine button state based on invite status
    const getInviteButtonProps = () => {
      if (!invite) {
        return {
          variant: 'contained' as const,
          color: 'primary' as const,
          disabled: invitingCreatorId === creator.id,
          onClick: () => {
            setSelectedCreator(creator);
            setInviteMessageModalOpen(true);
          },
          startIcon: null,
          children: invitingCreatorId === creator.id ? t('common:inviting') : t('common:invite'),
          sx: {
            minWidth: 140,
            height: 44,
            borderRadius: 2.5,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white !important',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
            },
            transition: 'all 0.2s ease',
          },
        };
      }

      switch (invite.status) {
        case PROJECT_INVITE_STATUS.PENDING:
          return {
            variant: 'contained' as const,
            disabled: true,
            startIcon: <Done />,
            children: t('common:invited'),
            sx: {
              minWidth: 140,
              height: 44,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white !important',
              opacity: 0.6,
            },
          };
        case PROJECT_INVITE_STATUS.DECLINED:
          return {
            variant: 'contained' as const,
            disabled: true,
            children: t('project:declined', 'Declined'),
            sx: {
              minWidth: 140,
              height: 44,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white !important',
              opacity: 0.6,
            },
          };
        case PROJECT_INVITE_STATUS.ACCEPTED:
          return {
            variant: 'contained' as const,
            disabled: true,
            startIcon: <Done />,
            children: t('common:invited'),
            sx: {
              minWidth: 140,
              height: 44,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white !important',
              opacity: 0.6,
            },
          };
        default:
          return {
            variant: 'contained' as const,
            disabled: true,
            children: t('project:expired', 'Expired'),
            sx: {
              minWidth: 140,
              height: 44,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white !important',
              opacity: 0.6,
            },
          };
      }
    };

    const inviteBtnProps = getInviteButtonProps() as any;

    return (
      <Slide in direction="up" timeout={300 + index * 100} key={creator.id}>
        <Card
          onMouseEnter={() => setHoveredCard(creator.id)}
          onMouseLeave={() => setHoveredCard(null)}
          sx={{
            mb: 3,
            borderRadius: 3,
            border:
              invite?.status === PROJECT_INVITE_STATUS.ACCEPTED
                ? `2px solid ${alpha('#10b981', 0.3)}`
                : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background:
              invite?.status === PROJECT_INVITE_STATUS.ACCEPTED
                ? 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
            boxShadow: '0 2px 2px rgba(0,0,0,0.12)',
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Header Section */}
            <Box display="flex" alignItems="flex-start" mb={3}>
              <Box position="relative">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  badgeContent={
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: statusColors.main,
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    />
                  }
                >
                  <UserAvatar
                    user={creator.user as User}
                    size="large"
                    width={60}
                    height={60}
                    sx={{ fontWeight: 600 }}
                  />
                </Badge>
              </Box>

              <Box ml={3} flexGrow={1}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {creator.user?.firstName} {creator.user?.lastName}
                  </Typography>
                  {verificationConfig && (
                    <Tooltip title={verificationConfig.label} arrow>
                      <Box
                        sx={{
                          ml: 1,
                          p: 0.5,
                          borderRadius: '50%',
                          backgroundColor: verificationConfig.bg,
                          color: verificationConfig.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {verificationConfig.icon}
                      </Box>
                    </Tooltip>
                  )}
                  <Tooltip title="View full profile" arrow>
                    <Box
                      onClick={() => handleViewProfile(creator.id)}
                      sx={{
                        cursor: 'pointer',
                        ml: 1,
                        p: 0.5,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      <Visibility fontSize="small" />
                    </Box>
                  </Tooltip>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Rating
                    value={creator.averageRating}
                    precision={0.1}
                    readOnly
                    size="small"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#fbbf24',
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 1,
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    ({creator.ratingCount})
                  </Typography>
                </Box>

                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    label={t(`user:${creator.verificationStatus.toLowerCase()}`)}
                    size="small"
                    icon={verificationConfig?.icon}
                    sx={{
                      backgroundColor:
                        verificationConfig?.bg || alpha(theme.palette.primary.main, 0.1),
                      color: verificationConfig?.color || theme.palette.primary.main,
                      fontWeight: 600,
                      border: 'none',
                      '& .MuiChip-icon': {
                        color: 'inherit',
                      },
                    }}
                  />
                  <Chip
                    label={t(`user:${creator.availability.toLowerCase()}`)}
                    size="small"
                    sx={{
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      fontWeight: 600,
                      border: 'none',
                    }}
                  />
                </Box>
              </Box>

              <Box display="flex" flexDirection="row" alignItems="flex-end" gap={1}>
                <Button
                  {...inviteBtnProps}
                  startIcon={
                    invitingCreatorId === creator.id ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      inviteBtnProps.startIcon
                    )
                  }
                  disabled={invitingCreatorId === creator.id || inviteBtnProps.disabled}
                >
                  {invitingCreatorId === creator.id
                    ? t('common:inviting')
                    : inviteBtnProps.children}
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 2, opacity: 0.6 }} />

            {/* Details Section */}
            <Box display="flex" flexWrap="wrap" gap={4} mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoney sx={{ fontSize: 20, color: theme.palette.success.main }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                >
                  ${creator.hourlyRate.toFixed(2)}/hr
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <WorkOutline sx={{ fontSize: 20, color: theme.palette.info.main }} />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                >
                  {creator.experience} {t('common:years_experience')}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <LanguageIcon sx={{ fontSize: 20, color: theme.palette.warning.main }} />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {creator.languages?.length || 0} languages
                </Typography>
              </Box>
            </Box>

            {/* Languages */}
            <Box mb={3}>
              <LanguageChips languages={creator.languages} />
            </Box>

            {/* Skills */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <TrendingUp sx={{ fontSize: 18 }} />
                {t('common:skills')}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {creator.skills?.slice(0, 6).map((skill, skillIndex) => (
                  <Zoom in timeout={400 + skillIndex * 50} key={skillIndex}>
                    <Chip
                      label={skill.replace(/_/g, ' ')}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.15),
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </Zoom>
                ))}
                {creator.skills?.length > 6 && (
                  <Chip
                    label={`+${creator.skills.length - 6} more`}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.grey[500], 0.1),
                      color: theme.palette.text.secondary,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                )}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Slide>
    );
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 0: // All Creators
        return {
          title: t('project:no_creators_found', 'No Creators Found'),
          description: t(
            'project:no_creators_description',
            'There are no creators available in the system at the moment.'
          ),
          icon: <PersonOffOutlined />,
        };
      case 1: // Uninvited
        return {
          title: t('project:no_uninvited_creators', 'No Uninvited Creators'),
          description: t(
            'project:no_uninvited_creators_description',
            'All available creators have already been invited to this project.'
          ),
          icon: <PersonOffOutlined />,
        };
      case 2: // Pending
        return {
          title: t('project:no_pending_invites', 'No Pending Invites'),
          description: t(
            'project:no_pending_invites_description',
            'There are no pending invitations for this project.'
          ),
          icon: <PersonOffOutlined />,
        };
      case 3: // Accepted
        return {
          title: t('project:no_accepted_invites', 'No Accepted Invites'),
          description: t(
            'project:no_accepted_invites_description',
            'No creators have accepted invitations to this project yet.'
          ),
          icon: <PersonOffOutlined />,
        };
      case 4: // Declined
        return {
          title: t('project:no_declined_invites', 'No Declined Invites'),
          description: t(
            'project:no_declined_invites_description',
            'No creators have declined invitations to this project.'
          ),
          icon: <PersonOffOutlined />,
        };
      default:
        return {
          title: t('project:no_creators_found', 'No Creators Found'),
          description: t(
            'project:no_creators_description',
            'There are no creators available in the system at the moment.'
          ),
          icon: <PersonOffOutlined />,
        };
    }
  };

  return (
    <Box>
      {/* Tabs for filtering creators */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              minHeight: 48,
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              backgroundColor: (() => {
                switch (activeTab) {
                  case 1:
                    return theme.palette.info.main;
                  case 2:
                    return theme.palette.warning.main;
                  case 3:
                    return theme.palette.success.main;
                  case 4:
                    return theme.palette.error.main;
                  default:
                    return theme.palette.primary.main;
                }
              })(),
            },
          }}
        >
          <Tab
            label={t('project:all_creators', 'All Creators')}
            sx={{
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            }}
          />
          <Tab
            label={t('project:uninvited', 'Uninvited')}
            sx={{
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.info.main,
              },
            }}
          />
          <Tab
            label={t('project:pending_invites', 'Pending')}
            sx={{
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.warning.main,
              },
            }}
          />
          <Tab
            label={t('project:accepted_invites', 'Accepted')}
            sx={{
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.success.main,
              },
            }}
          />
          <Tab
            label={t('project:declined_invites', 'Declined')}
            sx={{
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.error.main,
              },
            }}
          />
        </Tabs>
      </Box>

      <Box height={650} overflow="auto" sx={{ pr: 1 }}>
        {loading ? (
          renderEnhancedSkeleton()
        ) : (
          <Box>{creators.map((creator, index) => renderCreatorCard(creator, index))}</Box>
        )}

        {!loading && creators.length === 0 && (
          <Fade in timeout={600}>
            <Box
              width="100%"
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <StepperEmptyState
                icon={getEmptyStateContent().icon}
                title={getEmptyStateContent().title}
                description={getEmptyStateContent().description}
                showButton={false}
              />
            </Box>
          </Fade>
        )}
      </Box>

      <InviteMessageModal
        open={inviteMessageModalOpen}
        creator={selectedCreator}
        onClose={() => setInviteMessageModalOpen(false)}
        onSubmit={(message: string) => {
          if (selectedCreator) {
            handleInvite(selectedCreator.id, message);
          }
        }}
        loading={invitingCreatorId === selectedCreator?.id}
      />
    </Box>
  );
};

export default InviteCreatorsStep;
