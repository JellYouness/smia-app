import React from 'react';
import { Box, Stack, Typography, Chip } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { AttachMoney, FolderOpen, Group } from '@mui/icons-material';
import { User } from '@modules/users/defs/types';
import { useTranslation } from 'react-i18next';

interface BudgetProjectsSectionProps {
  user: User;
  readOnly?: boolean;
  onEdit: () => void;
}

const BudgetProjectsSection = ({ user, readOnly, onEdit }: BudgetProjectsSectionProps) => {
  const { t } = useTranslation();
  return (
    <SectionCard title={t('user:budget_and_projects')} readOnly={readOnly} onEdit={onEdit}>
      <Stack spacing={3}>
        {user?.client?.budget && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <AttachMoney color="secondary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                {t('user:budget_range')}
              </Typography>
              <Chip
                label={user.client.budget}
                size="medium"
                variant="outlined"
                color="secondary"
                sx={{ mt: 0.5 }}
                icon={<AttachMoney />}
              />
            </Box>
          </Stack>
        )}
        {user?.client?.projectCount !== undefined && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <FolderOpen color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:total_projects')}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {user.client.projectCount}
              </Typography>
            </Box>
          </Stack>
        )}
        {user?.client?.preferredCreators && user.client.preferredCreators.length > 0 && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Group color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {t('user:preferred_creators')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.client.preferredCreators.length}{' '}
                {t('user:creators_selected', { count: user.client.preferredCreators.length })}
              </Typography>
            </Box>
          </Stack>
        )}
      </Stack>
    </SectionCard>
  );
};

export default BudgetProjectsSection;
