import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import SectionCard from '@modules/users/components/SectionCard';
import { User } from '@modules/users/defs/types';
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

interface CompanyInfoSectionProps {
  user: User;
  readOnly?: boolean;
  onEdit: () => void;
}

const CompanyInfoSection = ({ user, readOnly, onEdit }: CompanyInfoSectionProps) => {
  const { t } = useTranslation();
  return (
    <SectionCard title="Company Information" readOnly={readOnly} onEdit={onEdit}>
      <Stack spacing={3}>
        {user?.client?.companyName && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <BusinessIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:company_name')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.client.companyName}
              </Typography>
            </Box>
          </Stack>
        )}
        {user?.client?.industry && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <ApartmentIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:industry')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.client.industry}
              </Typography>
            </Box>
          </Stack>
        )}
        {user?.client?.companySize && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <PeopleIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:company_size')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.client.companySize}
              </Typography>
            </Box>
          </Stack>
        )}
        {user?.client?.websiteUrl && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <LanguageIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:website')}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'primary.main' }}
                component={Link}
                href={user.client.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.client.websiteUrl}
              </Typography>
            </Box>
          </Stack>
        )}
      </Stack>
    </SectionCard>
  );
};

export default CompanyInfoSection;
