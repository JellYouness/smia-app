import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Rating,
  useTheme,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Paper,
  Tooltip,
  Skeleton,
} from '@mui/material';
import { Project, PROJECT_CREATOR_PERMISSION, ProjectCreator } from '@modules/projects/defs/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PersonOffOutlined,
  MoreVert,
  Visibility,
  Edit,
  AttachMoney,
  WorkOutline,
  VerifiedUser,
  EventAvailable,
} from '@mui/icons-material';
import useProjects, { projectCacheKey } from '@modules/projects/hooks/useProjects';
import { Id } from '@common/defs/types';
import useSWR from 'swr';

interface HiredCreatorStepProps {
  projectId: Id;
  project?: Project; // Make optional since we'll use SWR
}

const HiredCreatorStep = ({ projectId, project: propProject }: HiredCreatorStepProps) => {
  const { t } = useTranslation(['project', 'common', 'user']);
  const theme = useTheme();
  const { updateCreatorPermission, readOne } = useProjects();

  // Use SWR directly to get live project data
  const { data: projectData, isLoading } = useSWR(projectCacheKey(projectId), () =>
    readOne(projectId)
  );

  // Use SWR data if available, fallback to prop
  const project = projectData?.data?.item || propProject;
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCreator, setSelectedCreator] = useState<ProjectCreator | null>(null);
  const [updatingCreatorId, setUpdatingCreatorId] = useState<Id | null>(null);

  const primaryColor = theme.palette.primary;

  // Derive the two arrays from project data
  const softHires = project?.projectCreators?.filter((pc) => pc.status === 'confirmed') || [];
  const assignedHires = project?.projectCreators?.filter((pc) => pc.status === 'assigned') || [];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, creator: ProjectCreator) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedCreator(creator);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedCreator(null);
  };

  const handlePermissionChange = async (newPermission: PROJECT_CREATOR_PERMISSION) => {
    if (!selectedCreator) {
      return;
    }

    setUpdatingCreatorId(selectedCreator.creatorId);
    handleMenuClose();

    try {
      await updateCreatorPermission(projectId, selectedCreator.creatorId, newPermission, {
        displayProgress: true,
        displaySuccess: true,
      });
    } catch (error) {
      console.error('Error updating permission:', error);
    } finally {
      setUpdatingCreatorId(null);
    }
  };

  const renderCreatorCard = (projectCreator: ProjectCreator) => {
    const creator = projectCreator.creator;
    if (!creator) {
      return null;
    }

    const isUpdating = updatingCreatorId === creator.id;
    const isEditor = projectCreator.permission === PROJECT_CREATOR_PERMISSION.EDITOR;

    return (
      <Grid item xs={12} sm={6} md={4} key={projectCreator.id}>
        <Box position="relative">
          <Card
            elevation={2}
            sx={{
              height: '100%',
              borderLeft: `4px solid ${isEditor ? primaryColor.main : theme.palette.grey[400]}`,
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              opacity: isUpdating ? 0.7 : 1,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3,
              },
            }}
          >
            <CardContent sx={{ pb: '16px !important' }}>
              {/* Header with Avatar, Name, Rating, and Menu */}
              <Box display="flex" alignItems="flex-start" mb={2}>
                <Avatar
                  src={creator.user?.profileImage || ''}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                    mr: 2,
                    border: `2px solid ${theme.palette.background.paper}`,
                    boxShadow: 1,
                  }}
                >
                  {creator.user?.firstName?.[0]}
                  {creator.user?.lastName?.[0]}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="h6" fontWeight="bold" mb={0.5}>
                    {creator.user?.firstName} {creator.user?.lastName}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Rating
                      value={creator.averageRating}
                      precision={0.1}
                      readOnly
                      size="small"
                      sx={{ color: theme.palette.warning.main }}
                    />
                    <Typography variant="body2" ml={1} color="textSecondary">
                      ({creator.ratingCount})
                    </Typography>
                  </Box>
                  <Chip
                    label={t(`common:${projectCreator.permission}`)}
                    size="small"
                    color={isEditor ? 'primary' : 'secondary'}
                    variant={isEditor ? 'filled' : 'outlined'}
                    icon={isEditor ? <Edit fontSize="small" /> : <Visibility fontSize="small" />}
                    sx={{
                      fontWeight: 600,
                      borderRadius: '4px',
                    }}
                  />
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, projectCreator)}
                  sx={{ mt: -0.5 }}
                >
                  <MoreVert />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

              {/* Creator Details */}
              <Box>
                <DetailRow
                  icon={<AttachMoney fontSize="small" />}
                  label={t('common:hourly_rate')}
                  value={`$${creator.hourlyRate?.toFixed(2)}/hr`}
                />

                <DetailRow
                  icon={<WorkOutline fontSize="small" />}
                  label={t('common:experience')}
                  value={`${creator.experience} ${t('common:years_experience')}`}
                />

                <DetailRow
                  icon={<VerifiedUser fontSize="small" />}
                  label={t('common:verification_status')}
                  value={t(`user:${creator.verificationStatus.toLowerCase()}`)}
                />

                <DetailRow
                  icon={<EventAvailable fontSize="small" />}
                  label={t('common:availability')}
                  value={t(`user:${creator.availability.toLowerCase()}`)}
                />
              </Box>
            </CardContent>
          </Card>

          {isUpdating && (
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="rgba(255,255,255,0.7)"
              zIndex={1}
              borderRadius="8px"
            >
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      </Grid>
    );
  };

  const DetailRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
      <Box display="flex" alignItems="center">
        <Box
          sx={{
            color: 'text.secondary',
            mr: 1.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
      </Box>
      <Typography variant="body2" fontWeight="medium">
        {value}
      </Typography>
    </Box>
  );

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3].map((id) => (
        <Grid item xs={12} sm={6} md={4} key={id}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="flex-start" mb={3}>
                <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
                <Box flexGrow={1}>
                  <Skeleton width="70%" height={28} sx={{ mb: 0.5 }} />
                  <Skeleton width="50%" height={20} sx={{ mb: 1 }} />
                  <Skeleton width="30%" height={24} />
                </Box>
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box>
                {[1, 2, 3, 4].map((item) => (
                  <Box
                    key={item}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Skeleton width="40%" height={16} />
                    <Skeleton width="30%" height={16} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderEmptyState = () => (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 6,
        textAlign: 'center',
        borderRadius: 2,
        background: theme.palette.background.paper,
        border: `1px dashed ${theme.palette.divider}`,
        maxWidth: 500,
        mx: 'auto',
        my: 4,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={3}
        sx={{
          background:
            theme.palette.mode === 'light'
              ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${primaryColor.main} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${primaryColor.dark} 100%)`,
          borderRadius: '50%',
          width: 80,
          height: 80,
          boxShadow: 3,
        }}
      >
        <PersonOffOutlined sx={{ fontSize: 40, color: 'white' }} />
      </Box>
      <Typography variant="h6" mb={1} fontWeight="bold">
        {t('project:no_hired_creators_title')}
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        {t('project:no_hired_creators_description')}
      </Typography>
    </Paper>
  );

  return (
    <Box>
      <Box height={600} overflow="auto" pt={2}>
        {isLoading && renderSkeleton()}

        {!isLoading && !project && renderEmptyState()}

        {!isLoading && project && softHires.length === 0 && assignedHires.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {/* Confirmed (soft-hire) section */}
            {softHires.length > 0 && (
              <Box mb={4}>
                <Typography variant="h6" mb={2} fontWeight="bold" color="textPrimary">
                  {t('project:confirmed_soft_hire')}
                  <Chip
                    label={softHires.length}
                    size="small"
                    color="default"
                    sx={{ ml: 1.5, fontWeight: 600 }}
                  />
                </Typography>
                <Grid container spacing={3}>
                  {softHires.map(renderCreatorCard)}
                </Grid>
              </Box>
            )}

            {/* Assigned (active hire) section */}
            {assignedHires.length > 0 && (
              <Box>
                <Typography variant="h6" mb={2} fontWeight="bold" color="textPrimary">
                  {t('project:assigned_active_hire')}
                  <Chip
                    label={assignedHires.length}
                    size="small"
                    color="default"
                    sx={{ ml: 1.5, fontWeight: 600 }}
                  />
                </Typography>
                <Grid container spacing={3}>
                  {assignedHires.map(renderCreatorCard)}
                </Grid>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Permission Change Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 200,
            boxShadow: 3,
            borderRadius: '8px',
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <MenuItem
          onClick={() => handlePermissionChange(PROJECT_CREATOR_PERMISSION.VIEWER)}
          disabled={selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.VIEWER}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1.5,
          }}
        >
          <Visibility
            fontSize="small"
            color={
              selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.VIEWER
                ? 'disabled'
                : 'inherit'
            }
          />
          <Typography variant="body2">{t('common:make_viewer')}</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handlePermissionChange(PROJECT_CREATOR_PERMISSION.EDITOR)}
          disabled={selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.EDITOR}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1.5,
          }}
        >
          <Edit
            fontSize="small"
            color={
              selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.EDITOR
                ? 'disabled'
                : 'inherit'
            }
          />
          <Typography variant="body2">{t('common:make_editor')}</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HiredCreatorStep;
