import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Divider,
  Pagination,
  CircularProgress,
} from '@mui/material';
import useProjects from '@modules/projects/hooks/useProjects';
import ProjectCard from '@modules/projects/components/partials/ProjectCard';
import { Project, PROJECT_STATUS } from '@modules/projects/defs/types';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Routes from '@common/defs/routes';
import { Any } from '@common/defs/types';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: PROJECT_STATUS.DRAFT, label: 'Draft' },
  { value: PROJECT_STATUS.IN_PROGRESS, label: 'In Progress' },
  { value: PROJECT_STATUS.COMPLETED, label: 'Completed' },
  { value: PROJECT_STATUS.CANCELLED, label: 'Cancelled' },
];

const PAGE_SIZE = 12;

const ProjectsBrowsePage: NextPage = () => {
  const { t } = useTranslation(['project', 'common']);
  const { readAllPublicProjects } = useProjects();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<{ lastPage: number; total: number } | null>(
    null
  );

  useEffect(() => {
    fetchProjects();
  }, [search, status, minBudget, maxBudget, page]);

  const fetchProjects = async () => {
    setLoading(true);
    const filters: Any[] = [
      { filterColumn: 'is_public', filterOperator: 'equals', filterValue: true },
    ];
    if (search) {
      filters.push({ filterColumn: 'search', filterOperator: 'contains', filterValue: search });
    }
    if (status) {
      filters.push({ filterColumn: 'status', filterOperator: 'equals', filterValue: status });
    }
    if (minBudget) {
      filters.push({
        filterColumn: 'budget',
        filterOperator: 'gte',
        filterValue: Number(minBudget),
      });
    }
    if (maxBudget) {
      filters.push({
        filterColumn: 'budget',
        filterOperator: 'lte',
        filterValue: Number(maxBudget),
      });
    }
    const res = await readAllPublicProjects(page, PAGE_SIZE, undefined, filters);
    if (res.success && res.data) {
      setProjects(res.data.items);
      setPaginationMeta({ lastPage: res.data.meta.lastPage, total: res.data.meta.totalItems });
    } else {
      setProjects([]);
      setPaginationMeta(null);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        {t('project:browse_projects', 'Browse Projects')}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
        <TextField
          label={t('common:search')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label={t('project:status', 'Status')}
          select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          size="small"
          sx={{ minWidth: 140 }}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('project:min_budget', 'Min Budget')}
          type="number"
          value={minBudget}
          onChange={(e) => {
            setMinBudget(e.target.value);
            setPage(1);
          }}
          size="small"
          sx={{ minWidth: 100 }}
        />
        <TextField
          label={t('project:max_budget', 'Max Budget')}
          type="number"
          value={maxBudget}
          onChange={(e) => {
            setMaxBudget(e.target.value);
            setPage(1);
          }}
          size="small"
          sx={{ minWidth: 100 }}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress size={40} thickness={4} sx={{ mr: 2 }} />
          <Typography variant="body1">{t('common:loading', 'Loading...')}</Typography>
        </Box>
      )}
      {!loading && projects.length > 0 && (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard project={project} browsing />
            </Grid>
          ))}
        </Grid>
      )}
      {!loading && projects.length === 0 && (
        <Typography variant="body1">
          {t('project:no_projects_found', 'No projects found.')}
        </Typography>
      )}
      {paginationMeta && paginationMeta.lastPage > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={paginationMeta.lastPage}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'notifications',
      'topbar',
      'footer',
      'leftbar',
      'home',
      'client',
      'project',
      'user',
      'common',
    ])),
  },
});

export default withAuth(ProjectsBrowsePage, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
