import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Chip,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  VerifiedUser,
  Visibility,
  RateReview,
  Schedule,
} from '@mui/icons-material';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import Routes from '@common/defs/routes';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Namespaces from '@common/defs/namespaces';
import { CRUD_ACTION } from '@common/defs/types';
import useCreatorApplications from '@modules/creators/hooks/useCreatorApplications';
import useAmbassadorApplications from '@modules/ambassadors/hooks/useAmbassadorApplications';
import ApplicationReviewDialog from '@modules/creators/components/ApplicationReviewDialog';
import AmbassadorApplicationReviewDialog from '@modules/ambassadors/components/ApplicationReviewDialog';
import dayjs from 'dayjs';
import { Creator } from '@modules/creators/defs/types';
import { Ambassador } from '@modules/ambassadors/defs/types';
import UserAvatar from '@common/components/lib/partials/UserAvatar';
import { User } from '@modules/users/defs/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`applications-tabpanel-${index}`}
      aria-labelledby={`applications-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminApplicationsPage: NextPage = () => {
  const { t } = useTranslation(['user', 'common']);
  const [tabValue, setTabValue] = useState(0);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [selectedAmbassador, setSelectedAmbassador] = useState<Ambassador | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [ambassadorReviewDialogOpen, setAmbassadorReviewDialogOpen] = useState(false);
  const [creatorApplications, setCreatorApplications] = useState<Creator[]>([]);
  const [ambassadorApplications, setAmbassadorApplications] = useState<Ambassador[]>([]);
  const [creatorApplicationsLoading, setCreatorApplicationsLoading] = useState(false);
  const [ambassadorApplicationsLoading, setAmbassadorApplicationsLoading] = useState(false);
  const [reloadApplications, setReloadApplications] = useState(false);
  // Filter states
  const [creatorReviewFilter, setCreatorReviewFilter] = useState<string>('all');
  const [creatorStatusFilter, setCreatorStatusFilter] = useState<string>('all');
  const [ambassadorReviewFilter, setAmbassadorReviewFilter] = useState<string>('all');
  const [ambassadorStatusFilter, setAmbassadorStatusFilter] = useState<string>('all');

  const { getPendingApplications: getPendingCreatorApplications } = useCreatorApplications({
    fetchItems: true,
  });
  const { getPendingApplications: getAmbassadorApplications } = useAmbassadorApplications({
    fetchItems: true,
  });

  useEffect(() => {
    const fetchApplications = async () => {
      setCreatorApplicationsLoading(true);
      setAmbassadorApplicationsLoading(true);
      const creatorApplications = await getPendingCreatorApplications();
      const ambassadorApplications = await getAmbassadorApplications();
      setCreatorApplications(creatorApplications);
      setAmbassadorApplications(ambassadorApplications);
      setCreatorApplicationsLoading(false);
      setAmbassadorApplicationsLoading(false);
    };
    fetchApplications();
  }, [reloadApplications]);

  //   const { items: creatorApplications, mutate: refreshCreators } = useCreatorApplications({
  //     fetchItems: true,
  //   });

  //   const { items: ambassadorApplications, mutate: refreshAmbassadors } = useAmbassadorApplications({
  //     fetchItems: true,
  //   });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReviewCreator = (application: Creator) => {
    setSelectedCreator(application);
    setReviewDialogOpen(true);
  };

  const handleReviewAmbassador = (application: Ambassador) => {
    setSelectedAmbassador(application);
    setAmbassadorReviewDialogOpen(true);
  };

  const handleReviewComplete = () => {
    setReloadApplications(!reloadApplications);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
      case 'APPROVED':
        return <CheckCircle color="success" />;
      case 'PENDING':
        return <VerifiedUser color="warning" />;
      case 'UNVERIFIED':
      case 'REJECTED':
        return <Cancel color="error" />;
      default:
        return <Visibility />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'UNVERIFIED':
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  // Filter functions
  const getFilteredCreatorApplications = () => {
    if (!creatorApplications) {
      return [];
    }

    return creatorApplications.filter((application) => {
      const matchesReviewFilter =
        creatorReviewFilter === 'all' ||
        (creatorReviewFilter === 'reviewed' && application.reviewedAt) ||
        (creatorReviewFilter === 'not_reviewed' && !application.reviewedAt);

      const matchesStatusFilter =
        creatorStatusFilter === 'all' || application.verificationStatus === creatorStatusFilter;

      return matchesReviewFilter && matchesStatusFilter;
    });
  };

  const getFilteredAmbassadorApplications = () => {
    if (!ambassadorApplications) {
      return [];
    }

    return ambassadorApplications.filter((application) => {
      const matchesReviewFilter =
        ambassadorReviewFilter === 'all' ||
        (ambassadorReviewFilter === 'reviewed' && application.reviewedAt) ||
        (ambassadorReviewFilter === 'not_reviewed' && !application.reviewedAt);

      const matchesStatusFilter =
        ambassadorStatusFilter === 'all' ||
        application.applicationStatus === ambassadorStatusFilter;

      return matchesReviewFilter && matchesStatusFilter;
    });
  };

  return (
    <>
      <PageHeader title={t('user:admin_applications_title', 'Review Pending Applications')} />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: t('user:admin_applications_breadcrumb', 'Applications') },
        ]}
      />

      {/* Error handling will be handled by useItems hook automatically */}

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="applications tabs">
            <Tab label={`${t('user:creator_applications', 'Creator Applications')}`} />
            <Tab label={`${t('user:ambassador_applications', 'Ambassador Applications')}`} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Creator Applications Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t('user:review_status', 'Review Status')}</InputLabel>
                    <Select
                      value={creatorReviewFilter}
                      onChange={(e) => setCreatorReviewFilter(e.target.value)}
                      label={t('user:review_status', 'Review Status')}
                    >
                      <MenuItem value="all">{t('common:all', 'All')}</MenuItem>
                      <MenuItem value="reviewed">{t('user:reviewed', 'Reviewed')}</MenuItem>
                      <MenuItem value="not_reviewed">
                        {t('user:not_reviewed', 'Not Reviewed')}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t('user:verification_status', 'Status')}</InputLabel>
                    <Select
                      value={creatorStatusFilter}
                      onChange={(e) => setCreatorStatusFilter(e.target.value)}
                      label={t('user:verification_status', 'Status')}
                    >
                      <MenuItem value="all">{t('common:all', 'All')}</MenuItem>
                      <MenuItem value="UNVERIFIED">
                        {t('user:status.unverified', 'Unverified')}
                      </MenuItem>
                      <MenuItem value="PENDING">{t('user:status.pending', 'Pending')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('user:applicant', 'Applicant')}</TableCell>
                  <TableCell>{t('user:email', 'Email')}</TableCell>
                  <TableCell>{t('user:experience', 'Experience')}</TableCell>
                  <TableCell>{t('user:hourly_rate', 'Hourly Rate')}</TableCell>
                  <TableCell>{t('user:verification_status', 'Status')}</TableCell>
                  <TableCell>{t('user:created_at', 'Applied')}</TableCell>
                  <TableCell>{t('user:reviewed', 'Reviewed')}</TableCell>
                  <TableCell>{t('common:actions', 'Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {creatorApplicationsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  getFilteredCreatorApplications().map((application) => (
                    <TableRow
                      key={application.id}
                      //   sx={{
                      //     backgroundColor: !application.reviewedAt ? 'warning.lighter' : 'inherit',
                      //     '&:hover': {
                      //       backgroundColor: !application.reviewedAt
                      //         ? 'warning.light'
                      //         : 'action.hover',
                      //     },
                      //   }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <UserAvatar user={application.user as User} size="medium" />
                          <Box>
                            <Typography variant="subtitle2">
                              {application.user?.firstName} {application.user?.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {application.user?.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{application.user?.email}</TableCell>
                      <TableCell>
                        {application.experience} {t('user:years', 'years')}
                      </TableCell>
                      <TableCell>${application.hourlyRate}/hr</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(application.verificationStatus)}
                          label={
                            typeof t === 'function'
                              ? t(`user:status.${application.verificationStatus?.toLowerCase()}`, {
                                  defaultValue: application.verificationStatus,
                                })
                              : application.verificationStatus
                          }
                          color={getStatusColor(application.verificationStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{dayjs(application.createdAt).format('DD/MM/YYYY')}</TableCell>
                      <TableCell>
                        {application.reviewedAt ? (
                          <Chip
                            icon={<CheckCircle />}
                            label={dayjs(application.reviewedAt).format('DD/MM/YYYY')}
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip
                            icon={<Schedule />}
                            label={t('user:not_reviewed', 'Not Reviewed')}
                            color="warning"
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={t('user:review_application', 'Review Application')}>
                          <IconButton
                            onClick={() => handleReviewCreator(application)}
                            color="primary"
                            size="small"
                          >
                            <RateReview />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {getFilteredCreatorApplications().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {t(
                          'user:no_filtered_creator_applications',
                          'No creator applications match the current filters'
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Ambassador Applications Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t('user:review_status', 'Review Status')}</InputLabel>
                    <Select
                      value={ambassadorReviewFilter}
                      onChange={(e) => setAmbassadorReviewFilter(e.target.value)}
                      label={t('user:review_status', 'Review Status')}
                    >
                      <MenuItem value="all">{t('common:all', 'All')}</MenuItem>
                      <MenuItem value="reviewed">{t('user:reviewed', 'Reviewed')}</MenuItem>
                      <MenuItem value="not_reviewed">
                        {t('user:not_reviewed', 'Not Reviewed')}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t('user:application_status', 'Status')}</InputLabel>
                    <Select
                      value={ambassadorStatusFilter}
                      onChange={(e) => setAmbassadorStatusFilter(e.target.value)}
                      label={t('user:application_status', 'Status')}
                    >
                      <MenuItem value="all">{t('common:all', 'All')}</MenuItem>
                      <MenuItem value="PENDING">{t('user:status.pending', 'Pending')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('user:applicant', 'Applicant')}</TableCell>
                  <TableCell>{t('user:email', 'Email')}</TableCell>
                  <TableCell>{t('user:team_name', 'Team Name')}</TableCell>
                  <TableCell>{t('user:client_count', 'Client Count')}</TableCell>
                  <TableCell>{t('user:application_status', 'Status')}</TableCell>
                  <TableCell>{t('user:created_at', 'Applied')}</TableCell>
                  <TableCell>{t('user:reviewed', 'Reviewed')}</TableCell>
                  <TableCell>{t('common:actions', 'Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ambassadorApplicationsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  getFilteredAmbassadorApplications().map((application) => (
                    <TableRow
                      key={application.id}
                      //   sx={{
                      //     backgroundColor: !application.reviewedAt ? 'primary.lighter' : 'inherit',
                      //     '&:hover': {
                      //       backgroundColor: !application.reviewedAt
                      //         ? 'primary.light'
                      //         : 'action.hover',
                      //     },
                      //   }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <UserAvatar user={application.user as User} size="medium" />
                          <Box>
                            <Typography variant="subtitle2">
                              {application.user?.firstName} {application.user?.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {application.user?.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{application.user?.email}</TableCell>
                      <TableCell>{application.teamName}</TableCell>
                      <TableCell>{application.clientCount}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(application.applicationStatus)}
                          label={
                            typeof t === 'function'
                              ? t(`user:status.${application.applicationStatus?.toLowerCase()}`, {
                                  defaultValue: application.applicationStatus,
                                })
                              : application.applicationStatus
                          }
                          color={getStatusColor(application.applicationStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{dayjs(application.createdAt).format('DD/MM/YYYY')}</TableCell>
                      <TableCell>
                        {application.reviewedAt ? (
                          <Chip
                            icon={<CheckCircle />}
                            label={dayjs(application.reviewedAt).format('DD/MM/YYYY')}
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip
                            icon={<Schedule />}
                            label={t('user:not_reviewed', 'Not Reviewed')}
                            color="warning"
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={t('user:review_application', 'Review Application')}>
                          <IconButton
                            onClick={() => handleReviewAmbassador(application)}
                            color="primary"
                            size="small"
                          >
                            <RateReview />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {getFilteredAmbassadorApplications().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {t(
                          'user:no_filtered_ambassador_applications',
                          'No ambassador applications match the current filters'
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Box>

      {selectedCreator && (
        <ApplicationReviewDialog
          open={reviewDialogOpen}
          onClose={() => setReviewDialogOpen(false)}
          application={selectedCreator}
          onReviewComplete={handleReviewComplete}
        />
      )}

      {selectedAmbassador && (
        <AmbassadorApplicationReviewDialog
          open={ambassadorReviewDialogOpen}
          onClose={() => setAmbassadorReviewDialogOpen(false)}
          application={selectedAmbassador}
          onReviewComplete={handleReviewComplete}
        />
      )}
    </>
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
  withPermissions(AdminApplicationsPage, {
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
