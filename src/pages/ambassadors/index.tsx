import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Namespaces from '@common/defs/namespaces';
import { CRUD_ACTION } from '@common/defs/types';
import Routes from '@common/defs/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@common/layout/Layout';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Search, FilterList, LocationOn, Business, People, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useBrowseAmbassadors } from '@modules/ambassadors/hooks/useBrowseAmbassadors';
import { Ambassador } from '@modules/ambassadors/defs/types';
import NoAmbassadorsFound from '@modules/ambassadors/components/NoAmbassadorsFound';
import { TFunction } from 'next-i18next';
import { User } from '@modules/users/defs/types';

interface AmbassadorCardProps {
  ambassador: Ambassador & {
    user?: User;
  };
  onViewDetails: (id: number) => void;
  t: TFunction;
}

const AmbassadorCard = ({ ambassador, onViewDetails, t }: AmbassadorCardProps) => {
  const user = ambassador.user as User;

  const getStatusColor = (status: string) => {
    if (status === 'APPROVED') {
      return 'success';
    }
    if (status === 'PENDING') {
      return 'warning';
    }
    return 'error';
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar src={(user as User).profile?.avatar} sx={{ width: 40, height: 40, mr: 1 }}>
            {user.name?.charAt(0) || 'A'}
          </Avatar>
          <Box>
            <Typography variant="h6" component="h3" noWrap>
              {user.name || 'Ambassador'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={ambassador.applicationStatus}
            color={getStatusColor(ambassador.applicationStatus)}
            size="small"
            sx={{ mb: 1 }}
          />
          {ambassador.teamName && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
            >
              <Business sx={{ fontSize: 16, mr: 0.5 }} />
              {ambassador.teamName}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          {ambassador.specializations?.slice(0, 3).map((spec, index) => (
            <Chip
              key={index}
              label={spec}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {t('user:list.client_count')}: {ambassador.clientCount || 0}
          </Typography>
        </Box>

        {ambassador.businessCity && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {ambassador.businessCity}, {ambassador.businessCountry}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Visibility />}
            onClick={() => onViewDetails(ambassador.id)}
          >
            {t('user:list.view_details')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const BrowseAmbassadorsPage = () => {
  const { t } = useTranslation(['user', 'common']);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('');

  const { ambassadors, loading, error, filteredAmbassadors } = useBrowseAmbassadors({
    searchTerm,
    statusFilter,
    locationFilter,
  });

  const handleViewDetails = (id: number) => {
    router.push(`/ambassadors/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            {t('user:browse_ambassadors') || 'Browse Ambassadors'}
          </Typography>
          <Typography>Loading ambassadors...</Typography>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            {t('user:browse_ambassadors') || 'Browse Ambassadors'}
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t('user:browse_ambassadors') || 'Browse Ambassadors'}
      </Typography>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder={t('user:search_ambassadors') || 'Search ambassadors...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('user:status') || 'Status'}</InputLabel>
              <Select
                value={statusFilter}
                label={t('user:status') || 'Status'}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="ALL">{t('user:all_statuses') || 'All Statuses'}</MenuItem>
                <MenuItem value="APPROVED">{t('user:approved') || 'Approved'}</MenuItem>
                <MenuItem value="PENDING">{t('user:pending') || 'Pending'}</MenuItem>
                <MenuItem value="REJECTED">{t('user:rejected') || 'Rejected'}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder={t('user:location') || 'Location'}
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setLocationFilter('');
              }}
            >
              {t('user:clear_filters') || 'Clear'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t('user:showing_results', {
            count: filteredAmbassadors.length,
            total: ambassadors.length,
          }) || `Showing ${filteredAmbassadors.length} of ${ambassadors.length} ambassadors`}
        </Typography>
      </Box>

      {/* Ambassadors Grid */}
      {filteredAmbassadors.length > 0 ? (
        <Grid container spacing={3}>
          {filteredAmbassadors.map((ambassador) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={ambassador.id}>
              <AmbassadorCard
                ambassador={ambassador as Ambassador}
                onViewDetails={handleViewDetails}
                t={t}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoAmbassadorsFound />
      )}
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale || 'en';
  return {
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
  };
};

export default withAuth(
  withPermissions(BrowseAmbassadorsPage, {
    requiredPermissions: {
      entity: Namespaces.Ambassadors,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
