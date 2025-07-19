import {
  Article,
  BarChart,
  Brush,
  Camera,
  CheckCircle,
  Mic,
  Public,
  Star,
  Work,
} from '@mui/icons-material';
import {
  alpha,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { AvailabilityStatus, Creator, MediaType } from '@modules/creators/defs/types';
import { User } from '@modules/users/defs/types';
import { Project, PROJECT_STATUS } from '@modules/projects/defs/types';
import { useTranslation } from 'react-i18next';

interface DetailsPanelProps {
  creator: Creator;
  user: User;
  projects: Project[];
}

const DetailsPanel = ({ creator, user, projects }: DetailsPanelProps) => {
  const theme = useTheme();
  const { t } = useTranslation(['common', 'user', 'project']);

  const getMediaTypeIcon = (type: MediaType) => {
    switch (type) {
      case 'PHOTO':
        return <Camera fontSize="small" />;
      case 'VIDEO':
        return <Camera fontSize="small" />;
      case 'ARTICLE':
        return <Article fontSize="small" />;
      case 'AUDIO':
        return <Mic fontSize="small" />;
      case 'DESIGN':
        return <Brush fontSize="small" />;
      default:
        return <Work fontSize="small" />;
    }
  };

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

  const expertiseColorMap: Record<string, string> = {
    EXPERT: theme.palette.success.main,
    INTERMEDIATE: theme.palette.warning.main,
    BEGINNER: theme.palette.info.main,
  };
  return (
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
                <CheckCircle
                  color="primary"
                  fontSize="small"
                  sx={{ ml: 0.5, verticalAlign: 'text-top' }}
                />
              )}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Star color="warning" fontSize="small" />
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
            <BarChart sx={{ mr: 1, fontSize: 20 }} />
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
                ${creator?.hourlyRate != null ? Number(creator.hourlyRate).toFixed(2) : '0.00'}
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
              <Camera sx={{ mr: 1, fontSize: 20 }} />
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
                    <Public
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
                              expertiseColorMap[expertise.expertiseLevel] ??
                              theme.palette.info.main,
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
  );
};

export default DetailsPanel;
