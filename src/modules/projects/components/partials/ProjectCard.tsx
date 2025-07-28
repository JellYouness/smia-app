import { Project, PROJECT_STATUS } from '@modules/projects/defs/types';
import Routes from '@common/defs/routes';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  AttachMoney,
  HourglassTop,
  CalendarToday,
  WorkOutline,
  MoreVert,
  Edit,
  Delete,
  RocketLaunch,
  RateReview,
  PersonAdd,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
  hideAction?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  browsing?: boolean;
}

const ProjectCard = ({
  project,
  hideAction = false,
  onEdit,
  onDelete,
  browsing = false,
}: ProjectCardProps) => {
  const router = useRouter();
  const { t } = useTranslation(['client', 'common', 'project']);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isDraft = project.status === PROJECT_STATUS.DRAFT;

  const formatDate = (date?: string) => (date ? dayjs(date).format('MMM D, YYYY') : '');

  const formatBudget = (budget?: number) => (budget ? `$${Number(budget).toLocaleString()}` : '');

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    if (onEdit) {
      onEdit(project);
    } else {
      router.push(Routes.Projects.UpdateOne.replace('{id}', project.id.toString()));
    }
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    if (onDelete) {
      onDelete(project);
    }
  };

  const isUnassigned = !project.projectCreators || project.projectCreators.length === 0;

  const getActionLabel = () => {
    if (isDraft) {
      return t('project:resume_creation', 'Resume project creation');
    }

    if (project.status === PROJECT_STATUS.COMPLETED) {
      return t('project:view_project', 'View Project');
    }

    if (project.status === PROJECT_STATUS.CANCELLED) {
      return t('project:view_project', 'View Project');
    }

    if (isUnassigned && project.proposalsCount === 0) {
      return t('project:invite_creators', 'Invite Creators');
    }

    if (isUnassigned && project.proposalsCount && project.proposalsCount > 0) {
      return t('project:review_proposals', 'Review Proposals');
    }

    return t('project:view_project', 'View Project');
  };
  const actionLabel = getActionLabel();

  const getProjectRoute = () => {
    const base = Routes.Projects.HireCreator.replace('{id}', project.id.toString());

    if (isDraft) {
      return Routes.Projects.UpdateOne.replace('{id}', project.id.toString());
    }

    if (
      project.status === PROJECT_STATUS.COMPLETED ||
      project.status === PROJECT_STATUS.CANCELLED
    ) {
      return Routes.Projects.ReadOne.replace('{id}', project.id.toString());
    }

    if (isUnassigned) {
      const step = project.proposalsCount === 0 ? 'invite' : 'review';
      return { pathname: base, query: { step } };
    }

    return Routes.Projects.ReadOne.replace('{id}', project.id.toString());
  };

  const handleActionClick = () => {
    const route = getProjectRoute();
    router.push(route);
  };

  const isOnProjectPage =
    router.pathname === Routes.Projects.ReadOne.replace('{id}', '[id]') &&
    router.query.id === project.id.toString();

  const wouldNavigateToProjectPage = () => {
    const route = getProjectRoute();
    if (typeof route === 'string') {
      return route === Routes.Projects.ReadOne.replace('{id}', project.id.toString());
    }
    return false;
  };

  const shouldHideAction = isOnProjectPage && wouldNavigateToProjectPage();

  let statusLabel;
  if (isDraft) {
    statusLabel = t('project:draft');
  } else if (project.status === PROJECT_STATUS.IN_PROGRESS) {
    statusLabel = t('project:in_progress');
  } else if (project.status === PROJECT_STATUS.CANCELLED) {
    statusLabel = t('project:cancelled');
  } else {
    statusLabel = t('project:completed');
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
        boxShadow: 5,
        '&:hover': {
          boxShadow: 10,
          cursor: browsing ? 'pointer' : 'default',
          backgroundColor: browsing ? 'action.hover' : 'transparent',
        },
      }}
      onClick={() => {
        if (browsing) {
          router.push(Routes.Projects.ReadOne.replace('{id}', project.id.toString()));
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Typography variant="h6" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
            {project.title}
          </Typography>
          {!browsing && !hideAction && (
            <>
              <IconButton
                aria-label="project actions"
                aria-controls="project-actions-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                size="small"
                sx={{
                  alignSelf: 'flex-start',
                  mt: -1,
                  mr: -1,
                }}
              >
                <MoreVert />
              </IconButton>

              <Menu
                id="project-actions-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'project-actions-button',
                }}
              >
                {project.status === PROJECT_STATUS.CANCELLED ? (
                  <MenuItem onClick={handleDeleteClick}>
                    <Delete fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
                    <Typography variant="body2" color="error">
                      {t('project:delete_project')}
                    </Typography>
                  </MenuItem>
                ) : (
                  <>
                    {(project.status === PROJECT_STATUS.IN_PROGRESS ||
                      project.status === PROJECT_STATUS.COMPLETED) && (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          router.push({
                            pathname: Routes.Projects.ReadOne.replace(
                              '{id}',
                              project.id.toString()
                            ),
                            query: { tab: 'media' },
                          });
                        }}
                      >
                        <WorkOutline fontSize="small" sx={{ mr: 1.5 }} />
                        <Typography variant="body2">Media Workshop</Typography>
                      </MenuItem>
                    )}

                    <Divider sx={{ my: 1 }} />

                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        router.push({
                          pathname: Routes.Projects.HireCreator.replace(
                            '{id}',
                            project.id.toString()
                          ),
                          query: { step: 'invite' },
                        });
                      }}
                    >
                      <PersonAdd fontSize="small" sx={{ mr: 1.5 }} />
                      <Typography variant="body2">{t('project:invite_creators')}</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        router.push({
                          pathname: Routes.Projects.HireCreator.replace(
                            '{id}',
                            project.id.toString()
                          ),
                          query: { step: 'review' },
                        });
                      }}
                    >
                      <RateReview fontSize="small" sx={{ mr: 1.5 }} />
                      <Typography variant="body2">{t('project:proposals')}</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        router.push({
                          pathname: Routes.Projects.HireCreator.replace(
                            '{id}',
                            project.id.toString()
                          ),
                          query: { step: 'hire' },
                        });
                      }}
                    >
                      <WorkOutline fontSize="small" sx={{ mr: 1.5 }} />
                      <Typography variant="body2">{t('project:hire')}</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        router.push({
                          pathname: Routes.Projects.HireCreator.replace(
                            '{id}',
                            project.id.toString()
                          ),
                          query: { step: 'kickoff' },
                        });
                      }}
                    >
                      <RocketLaunch fontSize="small" sx={{ mr: 1.5 }} />
                      <Typography variant="body2">{t('project:kickoff', 'Kick-off')}</Typography>
                    </MenuItem>
                    <Divider sx={{ my: 1 }} />

                    <MenuItem onClick={handleEditClick}>
                      <Edit fontSize="small" sx={{ mr: 1.5 }} />
                      <Typography variant="body2">{t('project:edit_project')}</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleDeleteClick}>
                      <Delete fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
                      <Typography variant="body2" color="error">
                        {t('project:delete_project')}
                      </Typography>
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={1.5}>
          <Grid item xs={6}>
            <Meta
              icon={<AttachMoney fontSize="small" sx={{ color: 'success.main' }} />}
              label={t('project:budget')}
              value={formatBudget(project.budget)}
            />
          </Grid>

          <Grid item xs={6}>
            <Meta
              icon={<HourglassTop fontSize="small" sx={{ color: 'warning.main' }} />}
              label={t('project:timeline')}
              value={`${formatDate(project.startDate)} - ${formatDate(project.endDate)}`}
            />
          </Grid>

          <Grid item xs={6}>
            <Meta
              icon={<CalendarToday fontSize="small" sx={{ color: 'info.main' }} />}
              label={t('project:created')}
              value={formatDate(project.createdAt)}
            />
          </Grid>

          <Grid item xs={6}>
            <Meta
              icon={<WorkOutline fontSize="small" sx={{ color: 'primary.main' }} />}
              label={t('project:status')}
              value={statusLabel}
            />
          </Grid>
        </Grid>
      </CardContent>

      {!hideAction && !browsing && !shouldHideAction && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Button fullWidth variant="outlined" onClick={handleActionClick}>
            {actionLabel}
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default ProjectCard;

interface MetaProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}
const Meta = ({ icon, label, value }: MetaProps) => (
  <Box display="flex" alignItems="center">
    {icon}
    <Box ml={1}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  </Box>
);
