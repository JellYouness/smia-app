import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, useTheme, alpha } from '@mui/material';
import { VerifiedUser as VerifiedUserIcon } from '@mui/icons-material';
import { Project } from '@modules/projects/defs/types';
import useAuth from '@modules/auth/hooks/api/useAuth';
import useProjects from '@modules/projects/hooks/useProjects';
import { useTranslation } from 'react-i18next';
import { Creator } from '@modules/creators/defs/types';
import { PaginationMeta } from '@common/hooks/useItems';
import ProjectsPanel from './ProjectsPanel';
import DetailsPanel from './DetailsPanel';
import OffersPanel from './OffersPanel';

const CreatorDashboard = () => {
  const { t } = useTranslation(['project', 'user', 'common']);
  const theme = useTheme();
  const { readAllByCreator } = useProjects();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(1); // Fixed page size for projects - show only one project per page
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

  const creator = user?.creator as Creator | undefined;

  const getProjects = async (currentPage = page) => {
    if (user && creator) {
      setLoadingProjects(true);
      try {
        const response = await readAllByCreator(creator.id, currentPage, pageSize);
        if (response.success && response.data) {
          setProjects(response.data.items);
          setPaginationMeta({
            currentPage: response.data.meta.currentPage,
            lastPage: response.data.meta.lastPage,
            totalItems: response.data.meta.totalItems,
          });
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

  useEffect(() => {
    if (user && creator) {
      getProjects(page);
    }
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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

  if (!creator || !user) {
    return null;
  }

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
        <Grid item xs={12} md={9} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <ProjectsPanel
            projects={projects}
            loadingProjects={loadingProjects}
            paginationMeta={paginationMeta}
            onPageChange={handlePageChange}
          />
          <OffersPanel creator={creator} />
        </Grid>

        {/* Right: Profile & Stats */}
        <Grid item xs={12} md={3}>
          <DetailsPanel creator={creator} user={user} projects={projects} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreatorDashboard;
