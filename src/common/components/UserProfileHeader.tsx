import React from 'react';
import { Box, Typography, Tooltip, Chip, Button } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import VerifiedIcon from '@mui/icons-material/Verified';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import StarIcon from '@mui/icons-material/Star';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BusinessIcon from '@mui/icons-material/Business';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ProfilePicture from '@modules/users/components/ProfilePicture';
import { User } from '@modules/users/defs/types';
import router from 'next/router';

interface UserProfileHeaderProps {
  profilePicture: string | null;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  onUploadPicture?: (file: File) => Promise<void>;
  onDeletePicture?: () => Promise<void>;
  userRole?: 'creator' | 'client' | 'admin';
  user?: User;
  editable?: boolean;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  profilePicture,
  firstName,
  lastName,
  city,
  country,
  onUploadPicture,
  onDeletePicture,
  userRole,
  user,
  editable,
}) => {
  const progressBarColor = () => {
    if (!user?.profile?.profileCompleteness) {
      return 'grey.200';
    }
    if (user?.profile?.profileCompleteness === 100) {
      return 'success.main';
    }
    if (user?.profile?.profileCompleteness >= 75) {
      return 'warning.main';
    }
    if (user?.profile?.profileCompleteness >= 50) {
      return 'info.main';
    }
    return 'error.main';
  };

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <ProfilePicture
        src={profilePicture}
        onUpload={onUploadPicture || (() => Promise.resolve())}
        onDelete={onDeletePicture || (() => Promise.resolve())}
        editable={editable}
      />
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
        {firstName} {lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {city || country ? (
          <>
            {city}
            {country ? `, ${country}` : ''}
          </>
        ) : null}
      </Typography>
      {/* Profile Completeness Bar */}
      {userRole !== 'admin' && user?.profile?.profileCompleteness !== undefined && editable && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5, display: 'block' }}
          >
            Profile Completeness
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={user.profile.profileCompleteness}
              sx={{
                flex: 1,
                height: 8,
                borderRadius: 5,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': { backgroundColor: progressBarColor() },
              }}
            />
            <Typography
              variant="body2"
              sx={{ minWidth: 36, fontWeight: 600, color: progressBarColor() }}
            >
              {Math.round(user.profile.profileCompleteness)}%
            </Typography>
          </Box>
        </Box>
      )}
      {/* Creator extra info */}
      {userRole === 'creator' && user?.creator && (
        <Box sx={{ mb: 1, px: 2, py: 1, borderRadius: 2 }}>
          {/* Verification Status */}
          {(() => {
            const creator = user.creator;
            if (!creator) {
              return null;
            }
            const status = creator.verificationStatus as string;
            switch (status) {
              case 'VERIFIED':
                return (
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}
                  >
                    <Tooltip title="Verified">
                      <Chip
                        icon={<VerifiedIcon fontSize="small" />}
                        label="Verified"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 500, color: 'white', backgroundColor: 'success.main' }}
                      />
                    </Tooltip>
                  </Box>
                );
              case 'PENDING':
                return (
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}
                  >
                    <Tooltip title="Verification Pending">
                      <Chip
                        icon={<HourglassTopIcon fontSize="small" />}
                        label="Verification Pending"
                        color="warning"
                        variant="outlined"
                        sx={{ fontWeight: 500, color: 'white', backgroundColor: 'warning.main' }}
                      />
                    </Tooltip>
                  </Box>
                );
              case 'REJECTED':
                return (
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}
                  >
                    <Tooltip title="Verification Rejected">
                      <Chip
                        icon={<ErrorOutlineIcon fontSize="small" />}
                        label="Verification Rejected"
                        color="error"
                        variant="outlined"
                        sx={{ fontWeight: 500, color: 'white', backgroundColor: 'error.main' }}
                      />
                    </Tooltip>
                  </Box>
                );
              case 'UNVERIFIED':
                return (
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}
                  >
                    <Tooltip title="Not Verified">
                      <Chip
                        icon={<HelpOutlineIcon fontSize="small" />}
                        label="Not Verified"
                        color="default"
                        variant="outlined"
                        sx={{ fontWeight: 500, color: 'white', backgroundColor: 'grey.500' }}
                      />
                    </Tooltip>
                  </Box>
                );
              default:
                return null;
            }
          })()}
          {/* Experience */}
          {user.creator?.experience ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WorkHistoryIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {user.creator.experience} years of experience
              </Typography>
            </Box>
          ) : null}
          {/* Hourly Rate */}
          {user.creator?.hourlyRate ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MonetizationOnIcon fontSize="small" sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                ${user.creator.hourlyRate}/hr
              </Typography>
            </Box>
          ) : null}
          {/* Availability */}
          {user.creator?.availability ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EventAvailableIcon fontSize="small" sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {user.creator.availability}
              </Typography>
            </Box>
          ) : null}
          {/* Review (5 stars) */}
          {(user.creator?.averageRating !== undefined ||
            user.creator?.ratingCount !== undefined) && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {Array.from({ length: 5 }).map((_, i) => {
                let color = 'grey.300';
                if (user.creator?.averageRating) {
                  if (user.creator.averageRating >= i + 1) {
                    color = 'warning.main';
                  } else if (user.creator.averageRating > i && user.creator.averageRating < i + 1) {
                    color = 'warning.light';
                  }
                }
                return <StarIcon key={i} sx={{ color, fontSize: 20 }} />;
              })}
              <Typography variant="body2" sx={{ fontWeight: 500, ml: 1 }}>
                {user.creator?.averageRating ?? '-'}/5
                {user.creator?.ratingCount !== undefined ? ` (${user.creator.ratingCount})` : ''}
              </Typography>
            </Box>
          )}
        </Box>
      )}
      {/* Client extra info */}
      {userRole === 'client' && user?.client && (
        <Box sx={{ mb: 1, px: 2, py: 1, borderRadius: 2 }}>
          {user.client.projectCount !== undefined ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BusinessCenterIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {user.client.projectCount} Projects
              </Typography>
            </Box>
          ) : null}
          {user.client.industry ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BusinessIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {user.client.industry}
              </Typography>
            </Box>
          ) : null}
        </Box>
      )}
      {editable && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/users/edit-profile')}
        >
          Personal Information
        </Button>
      )}
    </Box>
  );
};

export default UserProfileHeader;
