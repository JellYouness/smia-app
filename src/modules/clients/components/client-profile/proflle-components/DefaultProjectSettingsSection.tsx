import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { InfoOutlined, NotificationsActive, AccessTime, Forum } from '@mui/icons-material';
import { User } from '@modules/users/defs/types';
import { useTranslation } from 'react-i18next';

interface DefaultProjectSettingsSectionProps {
  user: User;
  readOnly?: boolean;
  onEdit: () => void;
}

const DefaultProjectSettingsSection = ({
  user,
  readOnly,
  onEdit,
}: DefaultProjectSettingsSectionProps) => {
  const { t } = useTranslation();
  return (
    <SectionCard title={t('user:default_project_settings')} readOnly={readOnly} onEdit={onEdit}>
      <Stack spacing={3}>
        {user?.client?.defaultProjectSettings ? (
          <Stack spacing={3}>
            {user.client.defaultProjectSettings.notificationFrequency && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <NotificationsActive color="primary" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {t('user:notification_frequency')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    {user.client.defaultProjectSettings.notificationFrequency}
                  </Typography>
                </Box>
              </Stack>
            )}
            {user.client.defaultProjectSettings.timeline && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <AccessTime color="primary" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {t('user:timeline')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    {user.client.defaultProjectSettings.timeline}
                  </Typography>
                </Box>
              </Stack>
            )}
            {user.client.defaultProjectSettings.communicationPreference && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Forum color="primary" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {t('user:communication_preference')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    {user.client.defaultProjectSettings.communicationPreference}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Stack>
        ) : (
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'grey.50',
            }}
          >
            <InfoOutlined sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {t('user:no_default_project_settings')}
            </Typography>
          </Box>
        )}
      </Stack>
    </SectionCard>
  );
};

export default DefaultProjectSettingsSection;
