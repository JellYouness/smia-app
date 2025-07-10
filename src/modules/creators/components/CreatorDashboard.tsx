import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Stack,
  Badge,
  IconButton,
  useTheme,
  Divider,
  alpha,
  InputAdornment,
  TextField,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';
import { PROJECT_STATUS, Project } from '@modules/projects/defs/types';
import { Clear, MoreVert, Search } from '@mui/icons-material';
import useAuth from '@modules/auth/hooks/api/useAuth';

// Mock user data for relations
const mockUser = {
  id: 10,
  email: 'client@smia.fr',
  rolesNames: ['client'],
  permissionsNames: [],
  firstName: 'Alice',
  lastName: 'Doe',
  username: 'aliceclient',
  phoneNumber: '+1234567890',
  address: '123 Main St',
  city: 'Paris',
  state: 'IDF',
  country: 'France',
  postalCode: '75001',
  profilePicture: '',
  bio: 'Client bio',
  dateOfBirth: '1990-01-01',
  gender: 'female',
  preferredLanguage: 'ENGLISH',
  timezone: 'Europe/Paris',
  notificationPreferences: { email: true, sms: false, push: true },
  privacySettings: {
    profileVisibility: 'PUBLIC',
    showEmail: true,
    showPhone: false,
    showAddress: false,
  },
  socialMediaLinks: {},
  emergencyContact: { name: 'Bob', relationship: 'Friend', phone: '+1234567890' },
  preferences: { theme: 'LIGHT', language: 'ENGLISH', notifications: true },
};

const profile = {
  name: 'Jane Creator',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  verified: true,
  verificationStatus: 'VERIFIED',
  averageRating: 4.8,
  ratingCount: 32,
  skills: ['Photography', 'Video Editing', 'Animation'],
  isJournalist: true,
};

const engagedProjects: Project[] = [
  {
    id: 1,
    title: 'Documentary for Wildlife NGO',
    description: 'A wildlife documentary project for an NGO.',
    status: PROJECT_STATUS.IN_PROGRESS,
    startDate: '2024-07-01',
    endDate: '2024-08-15',
    budget: 5000,
    clientId: 10,
    client: mockUser,
    creatorId: 3,
    creator: undefined,
    ambassadorId: 20,
    ambassador: undefined,
  },
  {
    id: 2,
    title: 'Brand Video for Tech Startup',
    description: 'A brand video for a new tech startup.',
    status: PROJECT_STATUS.PENDING,
    startDate: '2024-07-10',
    endDate: '2024-07-30',
    budget: 3000,
    clientId: 11,
    client: {
      ...mockUser,
      id: 11,
      email: 'another@smia.fr',
      firstName: 'Bob',
      lastName: 'Smith',
      username: 'bobclient',
    },
    creatorId: 3,
    creator: undefined,
    ambassadorId: 21,
    ambassador: undefined,
  },
];

const historicProjects: Project[] = [
  {
    id: 3,
    title: 'Event Photography - Global Summit',
    description: 'Photography for a global summit event.',
    status: PROJECT_STATUS.COMPLETED,
    startDate: '2024-05-01',
    endDate: '2024-06-10',
    budget: 2000,
    clientId: 12,
    client: {
      ...mockUser,
      id: 12,
      email: 'summit@smia.fr',
      firstName: 'Carla',
      lastName: 'Summit',
      username: 'carlasummit',
    },
    creatorId: 3,
    creator: undefined,
    ambassadorId: 22,
    ambassador: undefined,
  },
  {
    id: 4,
    title: 'Short Film Animation',
    description: 'Animated short film for a festival.',
    status: PROJECT_STATUS.COMPLETED,
    startDate: '2024-04-01',
    endDate: '2024-05-22',
    budget: 4000,
    clientId: 13,
    client: {
      ...mockUser,
      id: 13,
      email: 'filmfest@smia.fr',
      firstName: 'Dan',
      lastName: 'Fest',
      username: 'danfest',
    },
    creatorId: 3,
    creator: undefined,
    ambassadorId: 23,
    ambassador: undefined,
  },
];

const notifications = [
  {
    id: 1,
    message: 'You have been invited to join a new project: "Brand Video for Tech Startup".',
    read: false,
    date: '2024-07-01',
  },
  {
    id: 2,
    message: 'Your profile has been verified! Congratulations!',
    read: true,
    date: '2024-06-28',
  },
];

const CreatorDashboard: React.FC = () => {
  const [tab, setTab] = useState<'ongoing' | 'completed'>('ongoing');
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();

  const { user } = useAuth();

  console.log(user);

  const getStatusColor = (status: PROJECT_STATUS) => {
    switch (status) {
      case PROJECT_STATUS.IN_PROGRESS:
        return 'primary';
      case PROJECT_STATUS.COMPLETED:
        return 'success';
      case PROJECT_STATUS.PENDING:
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter projects based on search term
  const filterProjects = (projects: Project[]) => {
    if (!searchTerm) {
      return projects;
    }
    const term = searchTerm.toLowerCase();
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        `${project.client?.firstName} ${project.client?.lastName}`.toLowerCase().includes(term)
    );
  };

  const clearSearch = () => setSearchTerm('');

  return (
    <>
      {/* Status Banner */}
      <Box
        sx={{
          width: '100%',
          px: 2,
          py: 1,
          mb: 2,
          borderRadius: 1,
          backgroundColor: profile.verified
            ? theme.palette.success.light
            : theme.palette.warning.light,
          color: profile.verified
            ? theme.palette.success.contrastText
            : theme.palette.warning.contrastText,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          letterSpacing: 1,
          fontSize: { xs: '0.95rem', md: '1.05rem' },
          boxShadow: 1,
        }}
        role="status"
        aria-live="polite"
      >
        {profile.verified
          ? `VERIFIED${profile.isJournalist ? ' • Journalist enabled' : ''}`
          : 'UNVERIFIED, complete your profile to unlock invitations'}
      </Box>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: '90%',
          margin: '0 auto',
          backgroundColor: theme.palette.background.default,
        }}
      >
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
                placeholder="Search projects..."
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
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.95),
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: alpha(theme.palette.divider, 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                }}
              />

              {/* Tabs */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignSelf: { xs: 'flex-start', sm: 'center' },
                  flexShrink: 0,
                }}
              >
                <Button
                  variant={tab === 'ongoing' ? 'contained' : 'outlined'}
                  onClick={() => setTab('ongoing')}
                  sx={{ borderRadius: 1, px: 3 }}
                >
                  Ongoing ({engagedProjects.length})
                </Button>
                <Button
                  variant={tab === 'completed' ? 'contained' : 'outlined'}
                  onClick={() => setTab('completed')}
                  sx={{ borderRadius: 1, px: 3 }}
                  color="secondary"
                >
                  Completed ({historicProjects.length})
                </Button>
              </Stack>
            </Box>

            {/* Project Cards */}
            <Grid container spacing={3}>
              {filterProjects(tab === 'ongoing' ? engagedProjects : historicProjects).map(
                (project) => (
                  <Grid item xs={12} key={project.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                        borderRadius: 1,
                        transition: 'background-color 0.2s ease-in-out',
                        cursor: 'pointer',
                        position: 'relative',
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        '&:hover': {
                          backgroundColor: theme.palette.background.paper,
                        },
                      }}
                      onClick={() => {
                        // Replace with navigation logic
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View project ${project.title}`}
                    >
                      <CardContent
                        sx={{ flexGrow: 1, pb: '16px !important', pointerEvents: 'none' }}
                      >
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {project.title}
                          </Typography>
                          <span style={{ pointerEvents: 'auto' }}>
                            <IconButton size="small" tabIndex={-1}>
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </span>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" mb={2}>
                          {project.description}
                        </Typography>

                        <Stack direction="row" spacing={1} mb={2}>
                          <Chip
                            label={project.status.replace('_', ' ')}
                            size="small"
                            color={getStatusColor(project.status)}
                            variant="outlined"
                            sx={{ pointerEvents: 'auto' }}
                          />
                          <Chip
                            label={`$${project.budget}`}
                            size="small"
                            variant="outlined"
                            color="info"
                            sx={{ pointerEvents: 'auto' }}
                          />
                        </Stack>

                        <Divider sx={{ my: 1.5 }} />

                        <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                          <Avatar
                            sx={{ width: 32, height: 32, pointerEvents: 'auto' }}
                            src={project.client?.profilePicture}
                          />
                          <Typography variant="body2">
                            {project.client?.firstName} {project.client?.lastName}
                          </Typography>
                        </Stack>

                        <Typography variant="caption" color="text.secondary">
                          {project.startDate ? formatDate(project.startDate) : ''} -{' '}
                          {project.endDate ? formatDate(project.endDate) : ''}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              )}

              {/* Empty State */}
              {filterProjects(tab === 'ongoing' ? engagedProjects : historicProjects).length ===
                0 && (
                <Grid item xs={12}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      boxShadow: 'none',
                      border: `1px dashed ${alpha(theme.palette.divider, 0.4)}`,
                    }}
                  >
                    <Search sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" mb={1}>
                      No projects found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm ? `No projects match "${searchTerm}"` : 'No projects available'}
                    </Typography>
                    {searchTerm && (
                      <Button variant="text" size="small" onClick={clearSearch} sx={{ mt: 2 }}>
                        Clear search
                      </Button>
                    )}
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Right: Profile & Notifications */}
          <Grid item xs={12} md={3}>
            <Stack spacing={3}>
              {/* Profile Card */}
              <Card
                sx={{
                  borderRadius: 1,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              >
                <CardContent>
                  <Stack alignItems="center" spacing={1.5} textAlign="center">
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        profile.verified ? (
                          <CheckCircleIcon color="success" fontSize="small" />
                        ) : null
                      }
                    >
                      <Avatar src={profile.avatar} sx={{ width: 80, height: 80, mb: 1.5 }} />
                    </Badge>

                    <Typography variant="h6" fontWeight={600}>
                      {profile.name}
                      {profile.verified && (
                        <CheckCircleIcon
                          color="success"
                          fontSize="small"
                          sx={{ ml: 0.5, verticalAlign: 'text-top' }}
                        />
                      )}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <StarIcon color="warning" fontSize="small" />
                      <Typography variant="body2">
                        <strong>{profile.averageRating}</strong> ({profile.ratingCount} ratings)
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      justifyContent="center"
                      mt={1}
                    >
                      {profile.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          sx={{ borderRadius: 1, mt: 0.5 }}
                        />
                      ))}
                    </Stack>

                    {profile.isJournalist && (
                      <Chip label="Journalist" color="info" size="small" sx={{ mt: 1.5 }} />
                    )}

                    <Button variant="contained" size="small" sx={{ mt: 2, borderRadius: 1, px: 3 }}>
                      Edit Profile
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Notifications Card */}
              <Card
                sx={{
                  borderRadius: 1,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <NotificationsIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Notifications
                    </Typography>
                    <Chip
                      label={notifications.length}
                      size="small"
                      color="primary"
                      sx={{ ml: 'auto' }}
                    />
                  </Stack>

                  <Stack spacing={1.5}>
                    {notifications.map((notif) => (
                      <Card
                        key={notif.id}
                        variant="outlined"
                        sx={{
                          borderRadius: 1,
                          borderLeft: `3px solid ${
                            notif.read ? 'transparent' : theme.palette.primary.main
                          }`,
                          backgroundColor: notif.read ? 'inherit' : 'action.hover',
                        }}
                      >
                        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Typography variant="body2" mb={0.5}>
                            {notif.message}
                          </Typography>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              {notif.date}
                            </Typography>
                            {!notif.read && (
                              <Button
                                size="small"
                                color="primary"
                                sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                              >
                                Mark as read
                              </Button>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CreatorDashboard;
