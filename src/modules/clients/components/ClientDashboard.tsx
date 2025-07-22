import { Project } from '@modules/projects/defs/types';
import useProjects from '@modules/projects/hooks/useProjects';
import { User } from '@modules/users/defs/types';
import {
  Box,
  Typography,
  Button,
  Grid,
  Skeleton,
  useMediaQuery,
  IconButton,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { Add, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Routes from '@common/defs/routes';
import EmptyStateOverview from '@modules/projects/components/partials/EmptyStateOverview';
import ProjectCard from '@modules/projects/components/partials/ProjectCard';

import useEmblaCarousel from 'embla-carousel-react';
import { useTheme } from '@mui/material/styles';

interface ClientDashboardProps {
  user: User;
}

const ClientDashboard = ({ user }: ClientDashboardProps) => {
  const { t } = useTranslation(['client', 'common']);
  const { readAllByClient, deleteOne } = useProjects();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));

  const slidesToShow = isLarge ? 2 : 1;
  const showArrows = projects.length > slidesToShow;
  const slideWidthPct = 100 / slidesToShow + '%';
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: projects.length > slidesToShow,
    skipSnaps: false,
    align: 'start',
  });

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
    const response = await readAllByClient(user.client!.id);
    if (response.success && response.data?.items) {
      setProjects(response.data.items);
    }
    setLoading(false);
  };

  const handleDeleteProject = async (project: Project) => {
    await deleteOne(project.id, { displayProgress: true, displaySuccess: true });
    fetchProjects();
  };

  if (loading) {
    return (
      <Box sx={{ mt: 5, width: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h3" fontWeight={500} letterSpacing={0.5} color="text.primary">
            {t('client:projects', 'Projects')}
          </Typography>
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>

        <Grid container spacing={3}>
          {[1, 2].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <Card>
                <CardContent>
                  {/* Header with title and menu button */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1.5}
                  >
                    <Skeleton variant="text" width="70%" height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>

                  {/* Description */}
                  <Box mb={2.5}>
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="90%" height={20} sx={{ mt: 0.5 }} />
                  </Box>

                  {/* Divider */}
                  <Divider sx={{ my: 2 }} />

                  {/* Metadata grid */}
                  <Grid container spacing={1.5}>
                    {/* Budget */}
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Box ml={1} flex={1}>
                          <Skeleton variant="text" width="60%" height={16} />
                          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 0.5 }} />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Timeline */}
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Box ml={1} flex={1}>
                          <Skeleton variant="text" width="60%" height={16} />
                          <Skeleton variant="text" width="90%" height={20} sx={{ mt: 0.5 }} />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Created */}
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Box ml={1} flex={1}>
                          <Skeleton variant="text" width="60%" height={16} />
                          <Skeleton variant="text" width="70%" height={20} sx={{ mt: 0.5 }} />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Status */}
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Box ml={1} flex={1}>
                          <Skeleton variant="text" width="60%" height={16} />
                          <Skeleton variant="text" width="50%" height={20} sx={{ mt: 0.5 }} />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Action button */}
                  <Box mt={2} pt={0}>
                    <Skeleton variant="rectangular" width="100%" height={36} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  let content;
  if (projects.length > 0) {
    if (isSmall) {
      content = (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} key={project.id}>
              <ProjectCard project={project} onDelete={handleDeleteProject} />
            </Grid>
          ))}
        </Grid>
      );
    } else {
      content = (
        <Box sx={{ position: 'relative' }}>
          {showArrows && (
            <IconButton
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!emblaApi}
              sx={{
                position: 'absolute',
                left: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
              }}
            >
              <ArrowBackIos />
            </IconButton>
          )}
          {showArrows && (
            <IconButton
              onClick={() => emblaApi?.scrollNext()}
              disabled={!emblaApi}
              sx={{
                position: 'absolute',
                right: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          )}

          <Box
            ref={emblaRef}
            sx={{
              overflow: 'hidden',
              px: 2,
              pt: 0.5,
              pb: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
              }}
            >
              {projects.map((project) => (
                <Box key={project.id} sx={{ flex: `0 0 ${slideWidthPct}` }}>
                  <ProjectCard project={project} onDelete={handleDeleteProject} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      );
    }
  } else {
    content = (
      <EmptyStateOverview
        icon={<WorkOutlineIcon sx={{ fontSize: 60, color: 'primary.main' }} />}
        title={t('client:no_projects_title')}
        description={t('client:no_projects_description')}
        action={
          <Button
            variant="outlined"
            color="primary"
            sx={{ px: 3, py: 1.5, fontWeight: 600, fontSize: 14, textTransform: 'none' }}
            startIcon={<Add />}
            onClick={() => router.push(Routes.Projects.CreateOne)}
          >
            {t('client:post_project_button')}
          </Button>
        }
      />
    );
  }

  return (
    <Box sx={{ mt: 5, width: '100%', position: 'relative' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h3" fontWeight={500}>
          {t('client:projects')}
        </Typography>
      </Box>
      {content}
    </Box>
  );
};

export default ClientDashboard;
