import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
// import { Any } from '@common/defs/types';

interface AboutSectionProps {
  title?: string;
  bio?: string;
  shortBio?: string;
  hourlyRate?: number | string;
  //   t?: Any;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title, bio, shortBio, hourlyRate }) => (
  <Box>
    {(title || hourlyRate) && (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 1,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {title || <Skeleton width="80%" />}
        </Typography>
        {hourlyRate !== undefined && hourlyRate !== null && (
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
            {typeof hourlyRate === 'number' ? `$${hourlyRate}/hr` : hourlyRate}
          </Typography>
        )}
      </Box>
    )}
    {/* <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
      {t ? t('user:bio') : 'Bio'}:
    </Typography> */}
    <Typography variant="body1" sx={{ mt: 1 }}>
      {bio || <Skeleton width="80%" />}
    </Typography>
    {shortBio !== undefined && <></>}
  </Box>
);

export default AboutSection;
