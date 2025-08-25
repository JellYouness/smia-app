import { Project, PROJECT_STATUS } from '@modules/projects/defs/types';
import {
  Clear,
  MoreVert,
  Search,
  Work,
  CalendarToday,
  AttachMoney,
  Group,
  TrendingUp,
  CheckCircle,
  Schedule,
  Cancel,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  Skeleton,
  Fade,
  Slide,
  Menu,
  MenuItem,
  LinearProgress,
  Pagination,
  Stack,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserAvatar from '@common/components/lib/partials/UserAvatar';
import { User } from '@modules/users/defs/types';
import { PaginationMeta } from '@common/hooks/useItems';
import { Theme } from '@mui/material/styles';

// Modern loading skeleton component
const LoadingSkeleton = ({ theme }: { theme: Theme }) => (
  <Fade in timeout={300}>
    <Box>
      {[1].map((index) => (
        <Card
          key={index}
          sx={{
            mb: { xs: 2, sm: 3 },
            borderRadius: { xs: 2, sm: 3 },
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.08),
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
              theme.palette.primary.main,
              0.02
            )} 100%)`,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Header skeleton */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'flex-start',
                mb: { xs: 2, sm: 3 },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  variant="text"
                  width="70%"
                  sx={{ borderRadius: 1, mb: 1, height: { xs: 28, sm: 40 } }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  sx={{ borderRadius: 1, height: { xs: 18, sm: 20 } }}
                />
              </Box>
              <Skeleton
                variant="circular"
                sx={{
                  ml: { xs: 0, sm: 2 },
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                }}
              />
            </Box>

            {/* Progress bar skeleton */}
            <Skeleton
              variant="rectangular"
              sx={{
                borderRadius: 1,
                mb: { xs: 2, sm: 3 },
                height: { xs: 6, sm: 8 },
              }}
            />

            {/* Info cards skeleton */}
            <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
              {[1, 2, 3].map((cardIndex) => (
                <Grid item xs={12} sm={4} key={cardIndex}>
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      borderRadius: { xs: 1.5, sm: 2 },
                      background: alpha(theme.palette.primary.main, 0.04),
                      height: { xs: 60, sm: 80 },
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Footer skeleton */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <Skeleton
                  variant="circular"
                  sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                />
                <Box>
                  <Skeleton
                    variant="text"
                    width={120}
                    sx={{ borderRadius: 1, mb: 0.5, height: { xs: 18, sm: 20 } }}
                  />
                  <Skeleton
                    variant="text"
                    width={80}
                    sx={{ borderRadius: 1, height: { xs: 14, sm: 16 } }}
                  />
                </Box>
              </Box>
              <Skeleton
                variant="rectangular"
                sx={{
                  borderRadius: { xs: 1.5, sm: 1 },
                  width: { xs: '100%', sm: 120 },
                  height: { xs: 40, sm: 36 },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  </Fade>
);

interface ProjectsPanelProps {
  projects: Project[];
  loadingProjects: boolean;
  paginationMeta: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

const ProjectsPanel = ({
  projects,
  loadingProjects,
  paginationMeta,
  onPageChange,
}: ProjectsPanelProps) => {
  const theme = useTheme();
  const { t } = useTranslation(['common', 'user', 'project']);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'ongoing' | 'completed' | 'other'>('ongoing');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [_selectedProject, setSelectedProject] = useState<Project | null>(null);

  const clearSearch = () => {
    setSearchTerm('');
    // Reset to first page when clearing search
    if (paginationMeta && paginationMeta.currentPage !== 1) {
      onPageChange(1);
    }
  };

  let filtered: Project[] = [];

  if (tab === 'ongoing') {
    filtered = projects.filter((p) => p.status === PROJECT_STATUS.IN_PROGRESS);
  } else if (tab === 'completed') {
    filtered = projects.filter((p) => p.status === PROJECT_STATUS.COMPLETED);
  } else {
    filtered = projects.filter(
      (p) => p.status !== PROJECT_STATUS.IN_PROGRESS && p.status !== PROJECT_STATUS.COMPLETED
    );
  }

  const filterProjects = (projects: Project[]) => {
    if (!searchTerm) {
      return projects;
    }

    const term = searchTerm.toLowerCase();
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term) ||
        `${project.client?.firstName} ${project.client?.lastName}`.toLowerCase().includes(term)
    );
  };

  const filteredProjects = filterProjects(filtered);

  const getStatusLabel = (status: PROJECT_STATUS) => {
    return t(`project:status.${status.toLowerCase()}`);
  };

  const getStatusColor = (status: PROJECT_STATUS) => {
    switch (status) {
      case PROJECT_STATUS.IN_PROGRESS:
        return 'primary';
      case PROJECT_STATUS.COMPLETED:
        return 'success';
      case PROJECT_STATUS.DRAFT:
        return 'warning';
      case PROJECT_STATUS.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: PROJECT_STATUS) => {
    switch (status) {
      case PROJECT_STATUS.IN_PROGRESS:
        return <TrendingUp fontSize="small" />;
      case PROJECT_STATUS.COMPLETED:
        return <CheckCircle fontSize="small" />;
      case PROJECT_STATUS.DRAFT:
        return <Schedule fontSize="small" />;
      case PROJECT_STATUS.CANCELLED:
        return <Cancel fontSize="small" />;
      default:
        return <Work fontSize="small" />;
    }
  };

  // Removed unused formatDate function

  const getProjectProgress = (project: Project) => {
    // Calculate progress based on project status and other factors
    switch (project.status) {
      case PROJECT_STATUS.COMPLETED:
        return 100;
      case PROJECT_STATUS.IN_PROGRESS:
        return 65; // Could be calculated based on actual project data
      case PROJECT_STATUS.DRAFT:
        return 10;
      case PROJECT_STATUS.CANCELLED:
        return 0;
      default:
        return 0;
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, project: Project) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedProject(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Card
        sx={{
          mb: { xs: 2, sm: 3 },
          borderRadius: { xs: 1, sm: 2 },
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', lg: 'center' },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {/* Search Section */}
            <Box sx={{ flex: 1, maxWidth: { xs: '100%', lg: '400px' } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Search Projects
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder={t('project:search_projects')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Reset to first page when searching
                  if (paginationMeta && paginationMeta.currentPage !== 1) {
                    onPageChange(1);
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearSearch}>
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    // backgroundColor: alpha(theme.palette.background.default, 0.4),
                    bgcolor: 'white',
                    borderRadius: 1,
                    '& fieldset': {
                      borderColor: alpha(theme.palette.divider, 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Box>

            {/* Tabs Section */}
            <Box sx={{ maxWidth: { xs: '100%', lg: 'auto' }, minWidth: { lg: '400px' } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Filter by Status
              </Typography>
              <Box
                sx={{
                  // backgroundColor: alpha(theme.palette.background.default, 0.4),
                  bgcolor: 'white',
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  overflow: 'hidden',
                }}
              >
                <Tabs
                  value={tab}
                  onChange={(_, newValue) => {
                    setTab(newValue);
                    // Reset to first page when changing tabs
                    if (paginationMeta && paginationMeta.currentPage !== 1) {
                      onPageChange(1);
                    }
                  }}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    minHeight: { xs: 40, sm: 44 },
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '1px 1px 0 0',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    },
                    '& .MuiTab-root': {
                      minHeight: { xs: 40, sm: 44 },
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      px: { xs: 1.5, sm: 2.5 },
                      py: 1,
                      minWidth: { xs: 120, sm: 'auto' },
                      '&.Mui-selected': {
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    },
                  }}
                >
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        <Typography
                          variant="body2"
                          fontWeight="inherit"
                          sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                          {t('project:ongoing')}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="inherit"
                          sx={{ display: { xs: 'block', sm: 'none' } }}
                        >
                          Ongoing
                        </Typography>
                        <Chip
                          label={
                            projects.filter((p) => p.status === PROJECT_STATUS.IN_PROGRESS).length
                          }
                          size="small"
                          color="primary"
                          sx={{
                            height: { xs: 18, sm: 20 },
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            fontWeight: 700,
                            minWidth: { xs: 20, sm: 24 },
                          }}
                        />
                      </Box>
                    }
                    value="ongoing"
                  />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        <Typography
                          variant="body2"
                          fontWeight="inherit"
                          sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                          {t('project:completed')}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="inherit"
                          sx={{ display: { xs: 'block', sm: 'none' } }}
                        >
                          Done
                        </Typography>
                        <Chip
                          label={
                            projects.filter((p) => p.status === PROJECT_STATUS.COMPLETED).length
                          }
                          size="small"
                          color="success"
                          sx={{
                            height: { xs: 18, sm: 20 },
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            fontWeight: 700,
                            minWidth: { xs: 20, sm: 24 },
                          }}
                        />
                      </Box>
                    }
                    value="completed"
                  />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        <Typography
                          variant="body2"
                          fontWeight="inherit"
                          sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                          {t('project:other')}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="inherit"
                          sx={{ display: { xs: 'block', sm: 'none' } }}
                        >
                          Other
                        </Typography>
                        <Chip
                          label={
                            projects.filter(
                              (p) =>
                                p.status !== PROJECT_STATUS.IN_PROGRESS &&
                                p.status !== PROJECT_STATUS.COMPLETED
                            ).length
                          }
                          size="small"
                          color="info"
                          sx={{
                            height: { xs: 18, sm: 20 },
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            fontWeight: 700,
                            minWidth: { xs: 20, sm: 24 },
                          }}
                        />
                      </Box>
                    }
                    value="other"
                  />
                </Tabs>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      {loadingProjects && <LoadingSkeleton theme={theme} />}

      {!loadingProjects && filteredProjects.length > 0 && (
        <Fade in timeout={500}>
          <Box>
            {filteredProjects.map((project, index) => (
              <Slide in direction="up" timeout={300 + index * 100} key={project.id}>
                <Card
                  sx={{
                    mb: { xs: 2, sm: 3 },
                    borderRadius: { xs: 2, sm: 3 },
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.08),
                    background: `linear-gradient(135deg, ${
                      theme.palette.background.paper
                    } 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: { xs: 'none', sm: 'translateY(-4px)' },
                      boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: 4,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    {/* Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'flex-start',
                        mb: { xs: 2, sm: 1 },
                        gap: { xs: 2, sm: 0 },
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            mb: 1,
                            lineHeight: 1.3,
                            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                          }}
                        >
                          {project.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: 1.6,
                            mb: { xs: 1, sm: 2 },
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                          }}
                        >
                          {project.description}
                        </Typography>
                      </Box>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                        gap={{ xs: 1, sm: 2 }}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                      >
                        {/* Status chip with icon */}
                        <Chip
                          icon={getStatusIcon(project.status)}
                          label={getStatusLabel(project.status)}
                          color={getStatusColor(project.status)}
                          variant="filled"
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            height: { xs: 28, sm: 32 },
                            '& .MuiChip-icon': {
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                            },
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, project)}
                          sx={{
                            ml: { xs: 0, sm: 2 },
                            alignSelf: { xs: 'flex-end', sm: 'center' },
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.15),
                            },
                          }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>

                    {/* Progress Bar */}
                    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        >
                          Project Progress
                        </Typography>
                        <Typography
                          variant="caption"
                          color="primary.main"
                          fontWeight={700}
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        >
                          {getProjectProgress(project)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getProjectProgress(project)}
                        sx={{
                          height: { xs: 6, sm: 8 },
                          borderRadius: 1,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 1,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          },
                        }}
                      />
                    </Box>

                    {/* Info Cards */}
                    <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 1 }}>
                      {/* Budget Card */}
                      {project.budget && (
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              p: { xs: 1.5, sm: 2 },
                              borderRadius: { xs: 1.5, sm: 2 },
                              background: `linear-gradient(135deg, ${alpha(
                                theme.palette.success.main,
                                0.1
                              )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                              display: 'flex',
                              alignItems: 'center',
                              gap: { xs: 1.5, sm: 2 },
                            }}
                          >
                            <AttachMoney
                              sx={{
                                color: theme.palette.success.main,
                                fontSize: { xs: 20, sm: 24 },
                              }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                              >
                                Budget
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                color="success.main"
                                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                              >
                                ${project.budget}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}

                      {/* Timeline Card */}
                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: { xs: 1.5, sm: 2 },
                            background: `linear-gradient(135deg, ${alpha(
                              theme.palette.info.main,
                              0.1
                            )} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1.5, sm: 2 },
                          }}
                        >
                          <CalendarToday
                            sx={{
                              color: theme.palette.info.main,
                              fontSize: { xs: 20, sm: 24 },
                            }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              Timeline
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="info.main"
                              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                            >
                              {project.startDate && project.endDate
                                ? `${dayjs(project.startDate).format('MMM DD')} - ${dayjs(
                                    project.endDate
                                  ).format('MMM DD')}`
                                : 'Not set'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Team Card */}
                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: { xs: 1.5, sm: 2 },
                            background: `linear-gradient(135deg, ${alpha(
                              theme.palette.secondary.main,
                              0.1
                            )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1.5, sm: 2 },
                          }}
                        >
                          <Group
                            sx={{
                              color: theme.palette.secondary.main,
                              fontSize: { xs: 20, sm: 24 },
                            }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              Team
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="secondary.main"
                              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                            >
                              {project.ambassador
                                ? `${project.ambassador.firstName} (Ambassador)`
                                : 'No ambassador assigned'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 1, borderColor: alpha(theme.palette.divider, 0.1) }} />

                    {/* Footer */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: { xs: 2, sm: 0 },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                        <UserAvatar user={project.client?.user as User} size="large" />
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color="text.primary"
                            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                          >
                            {project.client?.firstName} {project.client?.lastName}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                          >
                            Client • Last updated {dayjs(project.updatedAt).fromNow()}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        size="medium"
                        sx={{
                          borderRadius: { xs: 1.5, sm: 2 },
                          textTransform: 'none',
                          fontWeight: 600,
                          px: { xs: 2, sm: 3 },
                          py: { xs: 1, sm: 1.5 },
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          alignSelf: { xs: 'center', sm: 'auto' },
                          minWidth: { xs: '120px', sm: 'auto' },
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                          '&:hover': {
                            transform: { xs: 'none', sm: 'translateY(-1px)' },
                            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                          },
                        }}
                      >
                        {t('common:view_details')}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            ))}
          </Box>
        </Fade>
      )}

      {!loadingProjects && filteredProjects.length === 0 && (
        <Card
          sx={{
            textAlign: 'center',
            p: 4,
            boxShadow: 'none',
            border: `1px dashed ${alpha(theme.palette.divider, 0.4)}`,
          }}
        >
          <Work sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            {t('project:no_projects_found')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? t('project:no_projects_match', { searchTerm })
              : t('project:no_projects_available')}
          </Typography>
          {searchTerm && (
            <Button
              variant="text"
              size="small"
              onClick={clearSearch}
              sx={{ mt: 2 }}
              startIcon={<Clear />}
            >
              {t('common:clear_search')}
            </Button>
          )}
        </Card>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: `0 10px 25px ${alpha(theme.palette.common.black, 0.15)}`,
            borderRadius: 1,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Typography variant="body2">View Details</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Typography variant="body2">Edit Project</Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleMenuClose}>
          <Typography variant="body2" color="error.main">
            Archive Project
          </Typography>
        </MenuItem>
      </Menu>

      {/* Pagination */}
      {paginationMeta && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 3 } }}>
          <Pagination
            count={paginationMeta.lastPage}
            page={paginationMeta.currentPage}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            shape="rounded"
            size="medium"
            sx={{
              '& .MuiPagination-ul': {
                justifyContent: 'center',
                flexWrap: 'wrap',
              },
              '& .MuiPaginationItem-root': {
                fontWeight: 600,
                minWidth: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                margin: { xs: '0 2px', sm: '0 4px' },
                borderRadius: 1,
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: { xs: 'none', sm: 'translateY(-1px)' },
                },
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: 'white',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    transform: { xs: 'none', sm: 'translateY(-1px)' },
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProjectsPanel;
