import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Rating,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Paper,
  Collapse,
  Skeleton,
  alpha,
} from '@mui/material';
import {
  Project,
  PROJECT_CREATOR_PERMISSION,
  PROJECT_CREATOR_STATUS,
  ProjectCreator,
} from '@modules/projects/defs/types';
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
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Assignment,
  Block,
} from '@mui/icons-material';
import useProjects, { projectCacheKey } from '@modules/projects/hooks/useProjects';
import { Id } from '@common/defs/types';
import useSWR, { mutate } from 'swr';
import StepperEmptyState from '../StepperEmptyState';
import UserAvatar from '@common/components/lib/partials/UserAvatar';
import { User } from '@modules/users/defs/types';

interface HiredCreatorStepProps {
  projectId: Id;
  project?: Project;
}

const HiredCreatorStep = ({ projectId, project: propProject }: HiredCreatorStepProps) => {
  const { t } = useTranslation(['project', 'common', 'user']);
  const theme = useTheme();
  const { updateCreatorPermission, readOne, revokeCreatorPermission, removeCreatorFromProject } =
    useProjects({ autoRefetchAfterMutation: false });

  const { data: projectData, isLoading } = useSWR(projectCacheKey(projectId), () =>
    readOne(projectId)
  );

  const project = projectData?.data?.item || propProject;
  const [selectedCreator, setSelectedCreator] = useState<ProjectCreator | null>(null);
  const [updatingCreatorId, setUpdatingCreatorId] = useState<Id | null>(null);
  const [softHireExpanded, setSoftHireExpanded] = useState(true);
  const [assignedHireExpanded, setAssignedHireExpanded] = useState(true);

  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  const primaryColor = theme.palette.primary;

  const softHires =
    project?.projectCreators?.filter((pc) => pc.status === PROJECT_CREATOR_STATUS.CONFIRMED) || [];
  const assignedHires =
    project?.projectCreators?.filter((pc) => pc.status === PROJECT_CREATOR_STATUS.ASSIGNED) || [];

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, creator: ProjectCreator) => {
    setSelectedCreator(creator);
    const rect = e.currentTarget.getBoundingClientRect();

    // Position menu right next to the button
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
  };

  const handleMenuClose = () => {
    setMenuPosition(null);
    setSelectedCreator(null);
  };

  const handlePermissionChange = async (newPermission: PROJECT_CREATOR_PERMISSION) => {
    if (!selectedCreator) {
      return;
    }

    setUpdatingCreatorId(selectedCreator.creatorId);

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
    const isAssigned = projectCreator.status === PROJECT_CREATOR_STATUS.ASSIGNED;

    const { chipColor, chipVariant, chipIcon } = (() => {
      switch (projectCreator.permission) {
        case PROJECT_CREATOR_PERMISSION.EDITOR:
          return {
            chipColor: 'primary' as const,
            chipVariant: 'filled' as const,
            chipIcon: <Edit fontSize="small" />,
          };
        case PROJECT_CREATOR_PERMISSION.VIEWER:
          return {
            chipColor: 'secondary' as const,
            chipVariant: 'outlined' as const,
            chipIcon: <Visibility fontSize="small" />,
          };
        default:
          return {
            chipColor: 'warning' as const,
            chipVariant: 'outlined' as const,
            chipIcon: <Block fontSize="small" />,
          };
      }
    })();

    return (
      <Box key={projectCreator.id} position="relative">
        <Card
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: '12px',
            border: `1px solid ${theme.palette.divider}`,
            transition: 'all 0.2s ease',
            opacity: isUpdating ? 0.7 : 1,
            background: theme.palette.background.paper,
            '&:hover': {
              borderColor: primaryColor.main,
              boxShadow: `0 4px 20px ${alpha(primaryColor.main, 0.1)}`,
              transform: 'translateY(-1px)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              {/* Left Section - Avatar & Basic Info */}
              <Box display="flex" alignItems="center" flex={1}>
                <Box position="relative">
                  <UserAvatar
                    user={creator.user as User}
                    size="large"
                    width={60}
                    height={60}
                    sx={{
                      fontWeight: 600,
                      mr: 3,
                      border: `3px solid ${theme.palette.background.paper}`,
                      boxShadow: `0 4px 12px ${alpha(primaryColor.main, 0.2)}`,
                    }}
                  />
                  {isAssigned && (
                    <Box
                      position="absolute"
                      bottom={-2}
                      right={8}
                      sx={{
                        backgroundColor: theme.palette.success.main,
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${theme.palette.background.paper}`,
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 12, color: 'white' }} />
                    </Box>
                  )}
                </Box>

                <Box flex={1}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <Typography variant="h6" fontWeight="bold" mr={2}>
                      {creator.user?.firstName} {creator.user?.lastName}
                    </Typography>
                    <Chip
                      label={
                        projectCreator.permission
                          ? t(`common:${projectCreator.permission}`)
                          : t('project:no_permissions')
                      }
                      size="small"
                      color={chipColor}
                      variant={chipVariant}
                      icon={chipIcon}
                      sx={{
                        fontWeight: 600,
                        borderRadius: '6px',
                        height: 24,
                      }}
                    />
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <Rating
                      value={creator.averageRating}
                      precision={0.1}
                      readOnly
                      size="small"
                      sx={{ color: theme.palette.warning.main }}
                    />
                    <Typography variant="body2" ml={1} color="textSecondary" fontWeight={500}>
                      ({creator.ratingCount} reviews)
                    </Typography>
                  </Box>

                  {/* Status Badge */}
                  <Chip
                    label={isAssigned ? t('project:active_hire') : t('project:soft_hire')}
                    size="small"
                    color={isAssigned ? 'success' : 'info'}
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderRadius: '6px',
                      height: 24,
                      backgroundColor: alpha(
                        isAssigned ? theme.palette.success.main : theme.palette.info.main,
                        0.1
                      ),
                    }}
                  />
                </Box>
              </Box>

              {/* Center Section - Details Grid */}
              <Box
                display="flex"
                gap={4}
                alignItems="center"
                sx={{
                  minWidth: 400,
                  '@media (max-width: 900px)': {
                    display: 'none',
                  },
                }}
              >
                <DetailItem
                  icon={<AttachMoney sx={{ fontSize: 18, color: theme.palette.success.main }} />}
                  label={t('common:hourly_rate')}
                  value={`$${creator.hourlyRate?.toFixed(2)}/hr`}
                />

                <DetailItem
                  icon={<WorkOutline sx={{ fontSize: 18, color: theme.palette.info.main }} />}
                  label={t('common:experience')}
                  value={`${creator.experience}y`}
                />

                <DetailItem
                  icon={<VerifiedUser sx={{ fontSize: 18, color: theme.palette.primary.main }} />}
                  label={t('common:verification')}
                  value={creator.verificationStatus}
                />

                <DetailItem
                  icon={<EventAvailable sx={{ fontSize: 18, color: theme.palette.warning.main }} />}
                  label={t('common:availability')}
                  value={creator.availability}
                />
              </Box>

              {/* Right Section - Menu */}
              <Box ml={2}>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, projectCreator)}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>

            {/* Mobile Details - Show on smaller screens */}
            <Box
              sx={{
                display: 'none',
                '@media (max-width: 900px)': {
                  display: 'block',
                  mt: 3,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                },
              }}
            >
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <DetailItem
                  icon={<AttachMoney sx={{ fontSize: 18, color: theme.palette.success.main }} />}
                  label={t('common:hourly_rate')}
                  value={`$${creator.hourlyRate?.toFixed(2)}/hr`}
                />
                <DetailItem
                  icon={<WorkOutline sx={{ fontSize: 18, color: theme.palette.info.main }} />}
                  label={t('common:experience')}
                  value={`${creator.experience} years`}
                />
                <DetailItem
                  icon={<VerifiedUser sx={{ fontSize: 18, color: theme.palette.primary.main }} />}
                  label={t('common:verification')}
                  value={creator.verificationStatus}
                />
                <DetailItem
                  icon={<EventAvailable sx={{ fontSize: 18, color: theme.palette.warning.main }} />}
                  label={t('common:availability')}
                  value={creator.availability}
                />
              </Box>
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
            bgcolor="rgba(255,255,255,0.8)"
            zIndex={1}
            borderRadius="12px"
          >
            <CircularProgress size={32} />
          </Box>
        )}
      </Box>
    );
  };

  const DetailItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <Box textAlign="center" minWidth={80}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={0.5}>
        {icon}
      </Box>
      <Typography variant="caption" color="textSecondary" display="block" mb={0.5}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="bold" fontSize="0.85rem">
        {value}
      </Typography>
    </Box>
  );

  const CollapsibleSection = ({
    title,
    count,
    expanded,
    onToggle,
    children,
    icon,
    color,
  }: {
    title: string;
    count: number;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    icon: React.ReactNode;
    color: string;
  }) => (
    <Box mb={3}>
      <Card
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        <Box
          onClick={onToggle}
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(
              color,
              0.02
            )} 100%)`,
            borderBottom: expanded ? `1px solid ${theme.palette.divider}` : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(
                color,
                0.04
              )} 100%)`,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: alpha(color, 0.1),
                mr: 2,
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="textPrimary">
                {title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {count} creator{count !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center">
            <Chip
              label={count}
              size="small"
              sx={{
                bgcolor: color,
                color: 'white',
                fontWeight: 700,
                mr: 2,
                minWidth: 32,
              }}
            />
            <IconButton size="small">{expanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Box p={2}>{children}</Box>
        </Collapse>
      </Card>
    </Box>
  );

  const renderSkeleton = () => (
    <Box>
      {[1, 2].map((section) => (
        <Box key={section} mb={3}>
          <Card
            elevation={0}
            sx={{ borderRadius: '12px', border: `1px solid ${theme.palette.divider}` }}
          >
            <Box p={2.5}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Skeleton
                    variant="rectangular"
                    width={40}
                    height={40}
                    sx={{ borderRadius: '10px', mr: 2 }}
                  />
                  <Box>
                    <Skeleton width={150} height={24} sx={{ mb: 0.5 }} />
                    <Skeleton width={100} height={16} />
                  </Box>
                </Box>
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
            </Box>
            <Divider />
            <Box p={2}>
              {[1, 2].map((item) => (
                <Box key={item} mb={2}>
                  <Card
                    elevation={0}
                    sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: '12px' }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center">
                        <Skeleton variant="circular" width={60} height={60} sx={{ mr: 3 }} />
                        <Box flex={1}>
                          <Skeleton width="60%" height={24} sx={{ mb: 0.5 }} />
                          <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                          <Skeleton width="30%" height={24} />
                        </Box>
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      ))}
    </Box>
  );

  const renderEmptyState = () => (
    <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
      <StepperEmptyState
        icon={<PersonOffOutlined />}
        title={t('project:no_hired_creators_title')}
        description={t('project:no_hired_creators_description')}
        showButton={false}
      />
    </Box>
  );

  return (
    <Box>
      <Box height={600} overflow="auto" pt={1}>
        {isLoading && renderSkeleton()}

        {!isLoading && !project && renderEmptyState()}

        {!isLoading && project && softHires.length === 0 && assignedHires.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {/* Assigned Hires Section */}
            {assignedHires.length > 0 && (
              <CollapsibleSection
                title={t('project:assigned_active_hire')}
                count={assignedHires.length}
                expanded={assignedHireExpanded}
                onToggle={() => setAssignedHireExpanded(!assignedHireExpanded)}
                icon={<Assignment sx={{ fontSize: 20, color: theme.palette.success.main }} />}
                color={theme.palette.success.main}
              >
                {assignedHires.map(renderCreatorCard)}
              </CollapsibleSection>
            )}

            {/* Soft Hires Section */}
            {softHires.length > 0 && (
              <CollapsibleSection
                title={t('project:confirmed_soft_hire')}
                count={softHires.length}
                expanded={softHireExpanded}
                onToggle={() => setSoftHireExpanded(!softHireExpanded)}
                icon={<CheckCircle sx={{ fontSize: 20, color: theme.palette.info.main }} />}
                color={theme.palette.info.main}
              >
                {softHires.map(renderCreatorCard)}
              </CollapsibleSection>
            )}
          </>
        )}
      </Box>

      {/* Permission Change Menu */}
      <Menu
        open={Boolean(menuPosition)}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={menuPosition || undefined}
        sx={{ py: '30px !important' }}
        MenuListProps={{ disablePadding: true }}
        PaperProps={{
          sx: {
            minWidth: 200,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
            borderRadius: '12px',
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handlePermissionChange(PROJECT_CREATOR_PERMISSION.EDITOR);
          }}
          disabled={selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.EDITOR}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            p: 2,
            borderRadius: '8px',
            color:
              selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.EDITOR
                ? theme.palette.text.disabled
                : theme.palette.primary.main,
            bgcolor:
              selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.EDITOR
                ? alpha(theme.palette.primary.main, 0.08)
                : 'transparent',
            fontWeight:
              selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.EDITOR ? 700 : 500,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <Edit
            fontSize="small"
            color={
              selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.EDITOR
                ? 'disabled'
                : 'primary'
            }
          />
          <Typography variant="body2" fontWeight={500}>
            {t('common:make_editor')}
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            handlePermissionChange(PROJECT_CREATOR_PERMISSION.VIEWER);
          }}
          disabled={selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.VIEWER}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            p: 2,
            borderRadius: '8px',
            color:
              selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.VIEWER
                ? theme.palette.text.disabled
                : theme.palette.info.main,
            bgcolor:
              selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.VIEWER
                ? alpha(theme.palette.info.main, 0.08)
                : 'transparent',
            fontWeight:
              selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.VIEWER ? 700 : 500,
            '&:hover': {
              bgcolor: alpha(theme.palette.info.main, 0.08),
            },
          }}
        >
          <Visibility
            fontSize="small"
            color={
              selectedCreator?.permission === PROJECT_CREATOR_PERMISSION.VIEWER
                ? 'disabled'
                : 'info'
            }
          />
          <Typography variant="body2" fontWeight={500}>
            {t('common:make_viewer')}
          </Typography>
        </MenuItem>
        {/* Revoke Permission - only if creator has a permission */}
        {selectedCreator?.permission && (
          <MenuItem
            onClick={async () => {
              handleMenuClose();
              if (selectedCreator) {
                setUpdatingCreatorId(selectedCreator.creatorId);
                try {
                  await revokeCreatorPermission(projectId, selectedCreator.creatorId, {
                    displayProgress: true,
                    displaySuccess: true,
                  });
                  mutate(projectCacheKey(projectId));
                } catch (error) {
                  console.error('Error revoking permission:', error);
                } finally {
                  setUpdatingCreatorId(null);
                }
              }
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              p: 2,
              borderRadius: '8px',
              color: theme.palette.warning.main,
              fontWeight: 500,
              '&:hover': {
                bgcolor: alpha(theme.palette.warning.main, 0.08),
              },
            }}
          >
            <Block fontSize="small" color="warning" />
            <Typography variant="body2" fontWeight={500}>
              {t('project:revoke_permission', 'Revoke Permission')}
            </Typography>
          </MenuItem>
        )}
        {/* Remove from project - always show */}
        <MenuItem
          onClick={async () => {
            handleMenuClose();
            if (selectedCreator) {
              setUpdatingCreatorId(selectedCreator.creatorId);
              try {
                await removeCreatorFromProject(projectId, selectedCreator.creatorId, {
                  displayProgress: true,
                  displaySuccess: true,
                });
                mutate(projectCacheKey(projectId));
              } catch (error) {
                console.error('Error removing creator from project:', error);
              } finally {
                setUpdatingCreatorId(null);
              }
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            p: 2,
            borderRadius: '8px',
            color: theme.palette.error.main,
            fontWeight: 500,
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <PersonOffOutlined fontSize="small" color="error" />
          <Typography variant="body2" fontWeight={500}>
            {t('project:remove_from_project', 'Remove from project')}
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HiredCreatorStep;
