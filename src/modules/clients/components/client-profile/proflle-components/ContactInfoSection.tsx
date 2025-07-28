import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { Phone, Email, LocationOn } from '@mui/icons-material';
import { User } from '@modules/users/defs/types';
import { useTranslation } from 'react-i18next';

interface ContactInfoSectionProps {
  user: User;
  readOnly?: boolean;
  onEdit: () => void;
}

const ContactInfoSection = ({ user, readOnly, onEdit }: ContactInfoSectionProps) => {
  const { t } = useTranslation();
  return (
    <SectionCard title={t('user:contact_information')} readOnly={readOnly} onEdit={onEdit}>
      <Stack spacing={3}>
        {user?.profile?.contactPhone && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Phone color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:phone_number')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.profile.contactPhone}
              </Typography>
            </Box>
          </Stack>
        )}
        {user?.profile?.contactEmail && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Email color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:email_address')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.profile.contactEmail}
              </Typography>
            </Box>
          </Stack>
        )}
        {user?.profile?.city && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <LocationOn color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:location')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.profile.city}
                {user.profile.country ? `, ${user.profile.country}` : ''}
              </Typography>
            </Box>
          </Stack>
        )}
      </Stack>
    </SectionCard>
  );
};

export default ContactInfoSection;
