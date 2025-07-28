import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { User } from '@modules/users/defs/types';
import { useTranslation } from 'react-i18next';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

interface BillingInfoSectionProps {
  user: User;
  readOnly?: boolean;
  onEdit: () => void;
}

const BillingInfoSection = ({ user, readOnly, onEdit }: BillingInfoSectionProps) => {
  const { t } = useTranslation();
  return (
    <SectionCard title={t('user:billing_information')} readOnly={readOnly} onEdit={onEdit}>
      <Stack spacing={3}>
        {user?.client?.billingStreet && (
          <Stack direction="row" alignItems="flex-start" spacing={2}>
            <HomeIcon color="primary" sx={{ mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:billing_address')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.client.billingStreet}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.client.billingCity}, {user.client.billingState}{' '}
                {user.client.billingPostalCode}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.client.billingCountry}
              </Typography>
            </Box>
          </Stack>
        )}
        {user?.client?.taxIdentifier && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <ReceiptLongIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:tax_identifier')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.client.taxIdentifier}
              </Typography>
            </Box>
          </Stack>
        )}
      </Stack>
    </SectionCard>
  );
};

export default BillingInfoSection;
