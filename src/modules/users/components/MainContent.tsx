import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LockIcon from '@mui/icons-material/Lock';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';

import { Any } from '@common/defs/types';

import SectionCard from './SectionCard';

interface MainContentProps {
  user: Any;
  t: Any;
}

const MainContent = ({ user, t }: MainContentProps) => {
  return (
    <Stack spacing={0}>
      {/* Admin System Administrator Details Section */}
      {user?.systemAdministrator && (
        <SectionCard
          title={t('user:admin_system_administrator_details', 'System Administrator Details')}
        >
          <Stack spacing={1} flex={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <SecurityIcon color="primary" />
              <Typography variant="body2">
                <strong>{t('user:list.access_level', 'Access Level')}:</strong>{' '}
                {user.systemAdministrator.accessLevel}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <ApartmentIcon color="info" />
              <Typography variant="body2">
                <strong>{t('user:list.department', 'Departments')}:</strong>{' '}
                {(() => {
                  try {
                    const depts = JSON.parse(user.systemAdministrator.departments);
                    return Array.isArray(depts)
                      ? depts.join(', ')
                      : user.systemAdministrator.departments;
                  } catch {
                    return user.systemAdministrator.departments;
                  }
                })()}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <LockIcon color="secondary" />
              <Typography variant="body2">
                <strong>{t('user:security_clearance', 'Security Clearance')}:</strong>{' '}
                {user.systemAdministrator.securityClearance}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <ListAltIcon color="success" />
              <Typography variant="body2">
                <strong>{t('user:audit_log', 'Audit Log')}:</strong>{' '}
                {user.systemAdministrator.auditLog
                  ? t('common:enabled', 'Enabled')
                  : t('common:disabled', 'Disabled')}
              </Typography>
            </Box>
          </Stack>
          <Stack spacing={1} flex={1}>
            {user.systemAdministrator.emergencyContact && (
              <Box display="flex" alignItems="center" gap={1}>
                <ContactEmergencyIcon color="error" />
                <Typography variant="body2">
                  <strong>{t('user:emergency_contact', 'Emergency Contact')}:</strong>{' '}
                  {user.systemAdministrator.emergencyContact}
                </Typography>
              </Box>
            )}
          </Stack>
        </SectionCard>
      )}
      {
        <SectionCard title={t('user:contact_information', 'Contact Information')}>
          <Stack spacing={1}>
            {/* Contact Email */}
            <Typography variant="body2">
              <strong>{t('user:email', 'Email')}:</strong>{' '}
              {user?.profile?.contactEmail || user?.email}
            </Typography>
            {/* Contact Phone */}
            <Typography variant="body2">
              <strong>{t('user:phone_number', 'Phone')}:</strong>{' '}
              {user?.profile?.contactPhone || user?.phoneNumber}
            </Typography>
          </Stack>
        </SectionCard>
      }
    </Stack>
  );
};

export default MainContent;
