import { Project, PROJECT_STATUS } from '@modules/projects/defs/types';
import { Clear, MoreVert, Search, Work } from '@mui/icons-material';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ProjectsPanelProps {
  projects: Project[];
  loadingProjects: boolean;
}

const ProjectsPanel = ({ projects, loadingProjects }: ProjectsPanelProps) => {
  const theme = useTheme();
  const { t } = useTranslation(['common', 'user', 'project']);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'ongoing' | 'completed' | 'other'>('ongoing');

  const clearSearch = () => setSearchTerm('');

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

  const formatDate = (dateString: string | null) => {
    return dateString ? dayjs(dateString).format('MMM DD, YYYY') : 'N/A';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
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
      {loadingProjects && (
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
      )}

      {!loadingProjects && filteredProjects.length > 0 && (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} key={project.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.15),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                  },
                  position: 'relative',
                  overflow: 'visible',
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
                      <MoreVert fontSize="small" />
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
                      <Avatar sx={{ width: 32, height: 32 }} src={project.client?.profilePicture} />
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
    </Box>
  );
};

export default ProjectsPanel;
