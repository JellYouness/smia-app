import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Stack,
  Badge,
  IconButton,
  useTheme,
  Divider,
  alpha,
  InputAdornment,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  MoreVert as MoreVertIcon,
  VerifiedUser as VerifiedUserIcon,
  Language as LanguageIcon,
  CameraAlt as CameraIcon,
  Description as ArticleIcon,
  Mic as AudioIcon,
  Brush as DesignIcon,
  Public as RegionIcon,
  Description as DescriptionIcon,
  Public,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { PROJECT_STATUS, Project } from '@modules/projects/defs/types';
import useAuth from '@modules/auth/hooks/api/useAuth';
import useProjects from '@modules/projects/hooks/useProjects';
import { useTranslation } from 'react-i18next';
import {
  User,
  Creator,
  VerificationStatus,
  MediaType,
  AvailabilityStatus,
} from '@modules/users/defs/types';
import dayjs from 'dayjs';

const CreatorDashboard: React.FC = () => {
  const [tab, setTab] = useState<'ongoing' | 'completed' | 'other'>('ongoing');
  const { t } = useTranslation(['project', 'user', 'common']);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const { readAllByCreator } = useProjects();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const creator = user?.creator as Creator | undefined;

  const getProjects = async () => {
    if (user && creator) {
      setLoadingProjects(true);
      try {
        const response = await readAllByCreator(creator.id);
        if (response.data) {
          setProjects(response.data.items);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    }
  };

  useEffect(() => {
    getProjects();
  }, [user]);

  const getStatusColor = (status: PROJECT_STATUS) => {
    switch (status) {
      case PROJECT_STATUS.IN_PROGRESS:
        return 'primary';
      case PROJECT_STATUS.COMPLETED:
        return 'success';
      case PROJECT_STATUS.PENDING:
        return 'warning';
      case PROJECT_STATUS.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: PROJECT_STATUS) => {
    return t(`project:status.${status.toLowerCase()}`);
  };

  const formatDate = (dateString: string | null) => {
    return dateString ? dayjs(dateString).format('MMM DD, YYYY') : 'N/A';
  };

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

  const clearSearch = () => setSearchTerm('');

  const availabilityColorMap: Partial<Record<AvailabilityStatus, 'success' | 'warning' | 'error'>> =
    {
      AVAILABLE: 'success',
      LIMITED: 'warning',
      BUSY: 'error',
    };

  const availabilityLabelMap: Record<AvailabilityStatus, string> = {
    AVAILABLE: 'Available',
    LIMITED: 'Limited',
    BUSY: 'Busy',
    UNAVAILABLE: 'Unavailable',
  };

  const availColor = creator?.availability ? availabilityColorMap[creator.availability] : undefined;

  const availLabel = creator?.availability ? availabilityLabelMap[creator.availability] : '';

  const getVerificationStatus = () => {
    if (!creator) {
      return '';
    }

    switch (creator.verificationStatus) {
      case 'VERIFIED':
        return t('user:verified');
      case 'FEATURED':
        return t('user:featured_creator');
      case 'PENDING':
        return t('user:verification_pending');
      default:
        return t('user:unverified_complete_profile');
    }
  };

  const getVerificationColor = () => {
    if (!creator) {
      return 'warning';
    }

    switch (creator.verificationStatus) {
      case 'VERIFIED':
      case 'FEATURED':
        return 'success';
      case 'PENDING':
        return 'warning';
      default:
        return 'warning';
    }
  };

  const getAvailabilityColor = () => {
    if (!creator) {
      return 'default';
    }

    switch (creator.availability) {
      case 'AVAILABLE':
        return 'success';
      case 'LIMITED':
        return 'warning';
      case 'BUSY':
        return 'error';
      default:
        return 'default';
    }
  };

  const getMediaTypeIcon = (type: MediaType) => {
    switch (type) {
      case 'PHOTO':
        return <CameraIcon fontSize="small" />;
      case 'VIDEO':
        return <CameraIcon fontSize="small" />;
      case 'ARTICLE':
        return <ArticleIcon fontSize="small" />;
      case 'AUDIO':
        return <AudioIcon fontSize="small" />;
      case 'DESIGN':
        return <DesignIcon fontSize="small" />;
      default:
        return <WorkIcon fontSize="small" />;
    }
  };

  // Filter projects based on tab
  const filteredProjects = filterProjects(
    tab === 'ongoing'
      ? projects.filter((project) => project.status === PROJECT_STATUS.IN_PROGRESS)
      : tab === 'completed'
      ? projects.filter((project) => project.status === PROJECT_STATUS.COMPLETED)
      : projects.filter(
          (project) =>
            project.status !== PROJECT_STATUS.IN_PROGRESS &&
            project.status !== PROJECT_STATUS.COMPLETED
        )
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '90%', margin: '0 auto' }}>
      {/* Status Banner */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 1,
          backgroundColor: (theme) =>
            creator?.verificationStatus === 'UNVERIFIED' ||
            creator?.verificationStatus === 'PENDING'
              ? theme.palette.warning.light
              : theme.palette.success.light,
          color: (theme) =>
            creator?.verificationStatus === 'UNVERIFIED' ||
            creator?.verificationStatus === 'PENDING'
              ? theme.palette.warning.contrastText
              : theme.palette.success.contrastText,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 600,
          boxShadow: 1,
        }}
      >
        {creator?.verificationStatus === 'VERIFIED' ||
        creator?.verificationStatus === 'FEATURED' ? (
          <VerifiedUserIcon fontSize="small" />
        ) : null}
        <Box flexGrow={1}>
          {getVerificationStatus()}
          {Boolean(creator?.isJournalist) && ` • ${t('user:journalist_enabled')}`}
        </Box>
        {creator?.verificationStatus === 'UNVERIFIED' && (
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: 'white',
              color: theme.palette.warning.dark,
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.9),
              },
            }}
          >
            {t('user:complete_profile')}
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Left: Projects */}
        <Grid item xs={12} md={9}>
          {/* Search Bar & Tabs */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              mb: 3,
              position: 'sticky',
              top: theme.spacing(2),
              zIndex: 10,
              backgroundColor: alpha(theme.palette.background.default, 0.9),
              backdropFilter: 'blur(8px)',
              p: 1,
              borderRadius: 1,
            }}
          >
            {/* Search Bar */}
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder={t('project:search_projects')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: 400,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: alpha(theme.palette.divider, 0.2),
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                },
              }}
            />

            {/* Tabs */}
            <Tabs
              value={tab}
              onChange={(_, newValue) => setTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {t('project:ongoing')}
                    <Chip
                      label={projects.filter((p) => p.status === PROJECT_STATUS.IN_PROGRESS).length}
                      size="small"
                      color="primary"
                    />
                  </Box>
                }
                value="ongoing"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {t('project:completed')}
                    <Chip
                      label={projects.filter((p) => p.status === PROJECT_STATUS.COMPLETED).length}
                      size="small"
                      color="success"
                    />
                  </Box>
                }
                value="completed"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {t('project:other')}
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
                    />
                  </Box>
                }
                value="other"
              />
            </Tabs>
          </Box>

          {/* Project Cards */}
          {loadingProjects ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 320,
                width: '100%',
                py: 6,
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                borderRadius: 2,
                boxShadow: 0,
              }}
            >
              <CircularProgress size={48} thickness={4} color="primary" sx={{ mb: 3 }} />
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
                {t('project:loading_projects')}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                {t('project:loading_projects_hint')}
              </Typography>
            </Box>
          ) : filteredProjects.length > 0 ? (
            <Grid container spacing={3}>
              {filteredProjects.map((project) => (
                <Grid item xs={12} key={project.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                      borderRadius: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {project.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            {project.description}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" gap={1}>
                        <Chip
                          label={getStatusLabel(project.status)}
                          size="small"
                          color={getStatusColor(project.status)}
                          variant="outlined"
                        />
                        {project.budget && (
                          <Chip
                            label={`$${project.budget}`}
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                        )}
                        {project.ambassador && (
                          <Chip
                            label={`Ambassador: ${project.ambassador.firstName}`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        )}
                      </Stack>

                      <Divider sx={{ my: 1.5 }} />

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar
                            sx={{ width: 32, height: 32 }}
                            src={project.client?.profilePicture}
                          />
                          <Box>
                            <Typography variant="body2">
                              {project.client?.firstName} {project.client?.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {project.startDate ? formatDate(project.startDate) : ''} -{' '}
                              {project.endDate ? formatDate(project.endDate) : ''}
                            </Typography>
                          </Box>
                        </Stack>
                        <Button variant="outlined" size="small">
                          {t('common:view_details')}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card
              sx={{
                textAlign: 'center',
                p: 4,
                boxShadow: 'none',
                border: `1px dashed ${alpha(theme.palette.divider, 0.4)}`,
              }}
            >
              <WorkIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
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
                  startIcon={<ClearIcon />}
                >
                  {t('common:clear_search')}
                </Button>
              )}
            </Card>
          )}
        </Grid>

        {/* Right: Profile & Stats */}
        <Grid item xs={12} md={3}>
          <Stack spacing={3}>
            {/* Profile Card */}
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Stack alignItems="center" spacing={1.5} textAlign="center">
                  {availColor ? (
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Tooltip title={availLabel} arrow>
                          <Box
                            sx={{
                              width: 15,
                              height: 15,
                              borderRadius: '50%',
                              bgcolor: theme.palette[availColor].main,
                              border: `2px solid ${theme.palette.background.paper}`,
                              pointerEvents: 'auto',
                            }}
                          />
                        </Tooltip>
                      }
                    >
                      <Avatar src={user?.profilePicture} sx={{ width: 80, height: 80 }} />
                    </Badge>
                  ) : (
                    <Avatar src={user?.profilePicture} sx={{ width: 80, height: 80 }} />
                  )}

                  <Typography variant="h6" fontWeight={600}>
                    {user?.firstName} {user?.lastName}
                    {(creator?.verificationStatus === 'VERIFIED' ||
                      creator?.verificationStatus === 'FEATURED') && (
                      <CheckCircleIcon
                        color="primary"
                        fontSize="small"
                        sx={{ ml: 0.5, verticalAlign: 'text-top' }}
                      />
                    )}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <StarIcon color="warning" fontSize="small" />
                    <Typography variant="body2">
                      <strong>
                        {creator?.averageRating != null
                          ? Number(creator.averageRating).toFixed(1)
                          : '0.0'}
                      </strong>
                      ({creator?.ratingCount || 0} {t('user:ratings')})
                    </Typography>
                  </Stack>

                  {creator?.isJournalist && (
                    <Chip label={t('user:journalist')} color="info" size="small" sx={{ mt: 1 }} />
                  )}

                  <Stack
                    direction="row"
                    spacing={1}
                    mt={2}
                    flexWrap="wrap"
                    justifyContent="center"
                    gap={1}
                  >
                    {Array.from(new Set(creator?.skills))
                      .slice(0, 5)
                      .map((skill) => (
                        <Chip key={skill} label={skill} size="small" sx={{ borderRadius: 1 }} />
                      ))}
                    {creator?.skills && creator.skills.length > 5 && (
                      <Tooltip title={creator.skills.slice(5).join(', ')}>
                        <Chip label={`+${creator.skills.length - 5}`} size="small" />
                      </Tooltip>
                    )}
                  </Stack>

                  <Box sx={{ width: '100%', mt: 1, mb: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {t('user:profile_completeness')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.profile?.profileCompleteness}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={user?.profile?.profileCompleteness}
                      color={user?.profile?.profileCompleteness >= 100 ? 'success' : 'primary'}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        mt: 0.5,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                        },
                      }}
                    />
                    {user?.profile?.profileCompleteness < 100 && (
                      <Button
                        variant="text"
                        size="small"
                        sx={{ mt: 1, fontSize: '0.7rem' }}
                        onClick={() => {
                          console.log('Navigate to profile completion');
                        }}
                      >
                        {t('user:complete_profile')}
                      </Button>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  mb={2}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.primary.dark,
                  }}
                >
                  <BarChartIcon sx={{ mr: 1, fontSize: 20 }} />
                  {t('user:creator_stats')}
                </Typography>

                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{t('user:experience')}:</Typography>
                    <Typography fontWeight={500}>
                      {creator?.experience} {t('user:years')}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{t('user:certifications')}:</Typography>
                    <Typography fontWeight={500}>{creator?.certifications?.length || 0}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{t('user:hourly_rate')}:</Typography>
                    <Typography fontWeight={500}>
                      $
                      {creator?.hourlyRate != null ? Number(creator.hourlyRate).toFixed(2) : '0.00'}
                      /h
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{t('user:projects_completed')}:</Typography>
                    <Typography fontWeight={500}>
                      {projects.filter((p) => p.status === PROJECT_STATUS.COMPLETED).length}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Media Types Card */}
            {creator?.mediaTypes && creator.mediaTypes.length > 0 && (
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={2}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: theme.palette.primary.dark,
                    }}
                  >
                    <CameraIcon sx={{ mr: 1, fontSize: 20 }} />
                    {t('user:media_expertise')}
                  </Typography>

                  <Grid container spacing={1}>
                    {Array.from(new Set(creator.mediaTypes)).map((type) => (
                      <Grid item key={type}>
                        <Chip
                          icon={React.cloneElement(getMediaTypeIcon(type) as React.ReactElement, {
                            color: 'primary',
                          })}
                          label={type}
                          size="medium"
                          variant="filled"
                          sx={{
                            borderRadius: 1,
                            backgroundColor: alpha(theme.palette.primary.light, 0.15),
                            '& .MuiChip-label': {
                              fontWeight: 500,
                              color: theme.palette.text.primary,
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Regional Expertise Card */}
            {creator?.regionalExpertise && creator.regionalExpertise.length > 0 && (
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={2}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: theme.palette.secondary.dark,
                    }}
                  >
                    <Public sx={{ mr: 1, fontSize: 20 }} />
                    {t('user:regional_expertise')}
                  </Typography>

                  <Stack spacing={1.5}>
                    {creator.regionalExpertise.slice(0, 3).map((expertise, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          backgroundColor: alpha(theme.palette.background.paper, 0.7),
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.action.hover, 0.05),
                          },
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <RegionIcon
                            fontSize="small"
                            sx={{
                              color: theme.palette.secondary.main,
                              fontSize: 20,
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle1" fontWeight={500}>
                              {expertise.region}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor:
                                    expertise.expertiseLevel === 'EXPERT'
                                      ? theme.palette.success.main
                                      : expertise.expertiseLevel === 'INTERMEDIATE'
                                      ? theme.palette.warning.main
                                      : theme.palette.info.main,
                                }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                {t(`user:expertise.${expertise.expertiseLevel.toLowerCase()}`)}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>
                    ))}

                    {creator.regionalExpertise.length > 3 && (
                      <Button
                        size="small"
                        sx={{
                          mt: 1,
                          alignSelf: 'flex-start',
                          color: theme.palette.text.secondary,
                        }}
                      >
                        <Typography variant="caption" fontWeight={500}>
                          +{creator.regionalExpertise.length - 3} {t('common:more_regions')}
                        </Typography>
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreatorDashboard;
