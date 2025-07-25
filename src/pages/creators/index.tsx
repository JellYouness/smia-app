import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Divider,
  Pagination,
} from '@mui/material';
import useCreators from '@modules/creators/hooks/useCreators';
import { AvailabilityStatus } from '@modules/creators/defs/types';
import SearchIcon from '@mui/icons-material/Search';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Routes from '@common/defs/routes';
import { CRUD_ACTION } from '@common/defs/types';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Namespaces from '@common/defs/namespaces';
import SkillFilter from '@modules/creators/components/SkillFilter';
import MinRatingFilter from '@modules/creators/components/MinRatingFilter';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreatorRow from '@modules/creators/components/CreatorRow';

const AVAILABILITY_OPTIONS: AvailabilityStatus[] = ['AVAILABLE', 'LIMITED', 'UNAVAILABLE', 'BUSY'];

const SKILL_OPTIONS = [
  'PHOTOGRAPHY',
  'VIDEGRAPHY',
  'EDITING',
  'WRITING',
  'DESIGN',
  'ANIMATION',
  'TRANSLATION',
  'VOICEOVER',
  'MARKETING',
  'OTHER',
];
const RATING_OPTIONS = [1, 2, 3, 4, 5];

const PAGE_SIZE = 12;

const CreatorsBrowsePage = () => {
  const {
    items: creators,
    paginationMeta,
    readAll,
  } = useCreators({ fetchItems: true, pageSize: PAGE_SIZE });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [minRating, setMinRating] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['user', 'common']);

  // Backend search and pagination
  useEffect(() => {
    const filters = [];
    if (search) {
      filters.push({ filterColumn: 'search', filterOperator: 'contains', filterValue: search });
    }
    if (skillFilter.length > 0) {
      skillFilter.forEach((skill) => {
        filters.push({ filterColumn: 'skills', filterOperator: 'contains', filterValue: skill });
      });
    }
    if (availabilityFilter) {
      filters.push({
        filterColumn: 'availability',
        filterOperator: 'equals',
        filterValue: availabilityFilter,
      });
    }
    if (minRating) {
      filters.push({
        filterColumn: 'average_rating',
        filterOperator: 'gte',
        filterValue: Number(minRating),
      });
    }
    setLoading(true);
    readAll(page, PAGE_SIZE, undefined, filters).finally(() => setLoading(false));
  }, [page, search, skillFilter, availabilityFilter, minRating]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        {t('user:browse_creators', 'Browse Creators')}
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
        <SkillFilter
          value={skillFilter}
          onChange={(val) => {
            setSkillFilter(val);
            setPage(1);
          }}
          options={SKILL_OPTIONS}
        />
        <TextField
          label={t('user:availability')}
          select
          value={availabilityFilter}
          onChange={(e) => {
            setAvailabilityFilter(e.target.value);
            setPage(1);
          }}
          size="small"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">{t('common:all', 'All')}</MenuItem>
          {AVAILABILITY_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {t(`user:${option.toLowerCase()}`)}
            </MenuItem>
          ))}
        </TextField>
        <MinRatingFilter
          value={minRating}
          onChange={(val) => {
            setMinRating(val);
            setPage(1);
          }}
          options={RATING_OPTIONS}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box>
        {(() => {
          if (loading) {
            return <Typography variant="body1">{t('common:loading', 'Loading...')}</Typography>;
          }
          if (creators && creators.length > 0) {
            return creators.map((creator) => <CreatorRow creator={creator} key={creator.id} />);
          }
          return (
            <Typography variant="body1">{t('common:no_element', 'No creators found.')}</Typography>
          );
        })()}
      </Box>
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
      'topbar',
      'footer',
      'leftbar',
      'user',
      'common',
      'notifications',
    ])),
  },
});

export default withAuth(
  withPermissions(CreatorsBrowsePage, {
    requiredPermissions: {
      entity: Namespaces.Creators,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
