import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { People } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface NoAmbassadorsFoundProps {
  message?: string;
  subMessage?: string;
}

const NoAmbassadorsFound: React.FC<NoAmbassadorsFoundProps> = ({ message, subMessage }) => {
  const { t } = useTranslation(['user']);

  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <People
          sx={{
            fontSize: 64,
            color: 'text.secondary',
            mb: 2,
            opacity: 0.6,
          }}
        />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          {message || t('user:no_ambassadors_found') || 'No ambassadors found'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subMessage ||
            t('user:try_adjusting_filters') ||
            'Try adjusting your search criteria or filters'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default NoAmbassadorsFound;
