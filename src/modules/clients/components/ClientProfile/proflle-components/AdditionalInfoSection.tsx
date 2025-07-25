import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { Language, AccessTime, CalendarToday } from '@mui/icons-material';
import { User } from '@modules/users/defs/types';
import { useTranslation } from 'react-i18next';

interface AdditionalInfoSectionProps {
  user: User;
  readOnly?: boolean;
}

const AdditionalInfoSection = ({ user, readOnly }: AdditionalInfoSectionProps) => {
  const { t } = useTranslation();
  return (
    <SectionCard title={t('user:additional_information')} readOnly={readOnly}>
      <Stack spacing={3}>
        {user?.profile?.preferredLanguage && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Language color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:preferred_language')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.profile.preferredLanguage}
              </Typography>
            </Box>
          </Stack>
        )}
        {user?.profile?.timezone && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <AccessTime color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:timezone')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.profile.timezone}
              </Typography>
            </Box>
          </Stack>
        )}
        {user?.dateRegistered && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <CalendarToday color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:member_since')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {new Date(user.dateRegistered).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
        )}
      </Stack>
    </SectionCard>
  );
};

export default AdditionalInfoSection;
