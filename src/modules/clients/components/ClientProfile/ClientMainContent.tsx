import React, { useState } from 'react';
import { Box, Stack, Typography, Skeleton, Chip } from '@mui/material';
import { AttachMoney } from '@mui/icons-material';
import Link from 'next/link';
import { Any } from '@common/defs/types';
import SectionCard from '@modules/users/components/SectionCard';
import EditAboutDialog from '@modules/creators/components/CreatorProfle/EditAboutDialog';
import EditCompanyDialog from '@modules/clients/components/ClientProfile/EditCompanyDialog';
import EditBillingDialog from '@modules/clients/components/ClientProfile/EditBillingDialog';
import EditBudgetProjectsDialog from './EditBudgetProjectsDialog';
import EditDefaultProjectSettingsDialog from './EditDefaultProjectSettingsDialog';
import EditContactInfoDialog from './EditContactInfoDialog';

import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';
import { User } from '@modules/users/defs/types';
import { TFunction } from 'i18next';

interface ClientMainContentProps {
  user: User;
  t: TFunction;
  readOnly?: boolean;
}

const ClientMainContent = ({ user, t, readOnly }: ClientMainContentProps) => {
  const [openAbout, setOpenAbout] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [openBilling, setOpenBilling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openBudgetProjects, setOpenBudgetProjects] = useState(false);
  const [openDefaultProjectSettings, setOpenDefaultProjectSettings] = useState(false);
  const [openContactInfo, setOpenContactInfo] = useState(false);

  const {
    updateAbout,
    updateCompany,
    updateBilling,
    updateBudgetProjects,
    updateDefaultProjectSettings,
    updateContactInfo,
  } = useProfileUpdates();

  const handleSaveAbout = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateAbout(user.id, data);
      if (response.success) {
        setOpenAbout(false);
      }
    } catch (error) {
      console.error('Error saving about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateCompany(user.id, {
        company_name: data.companyName,
        company_size: data.companySize,
        industry: data.industry,
        website_url: data.websiteUrl,
      });
      if (response.success) {
        setOpenCompany(false);
      }
    } catch (error) {
      console.error('Error saving company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBilling = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateBilling(user.id, {
        billing_street: data.billingStreet,
        billing_city: data.billingCity,
        billing_state: data.billingState,
        billing_postal_code: data.billingPostalCode,
        billing_country: data.billingCountry,
        tax_identifier: data.taxIdentifier,
      });
      if (response.success) {
        setOpenBilling(false);
      }
    } catch (error) {
      console.error('Error saving billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudgetProjects = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateBudgetProjects(user.id, {
        budget: data.budget, // pass as string
        projectCount: Number(data.projectCount),
        preferredCreators: data.preferredCreators,
      });
      if (response.success) {
        setOpenBudgetProjects(false);
      }
    } catch (error) {
      console.error('Error saving budget & projects data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDefaultProjectSettings = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateDefaultProjectSettings(user.id, data);
      if (response.success) {
        setOpenDefaultProjectSettings(false);
      }
    } catch (error) {
      console.error('Error saving default project settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContactInfo = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateContactInfo(user.id, data);
      if (response.success) {
        setOpenContactInfo(false);
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={0}>
      {/* Title/About Section */}
      <SectionCard title={t('user:about')} readOnly={readOnly} onEdit={() => setOpenAbout(true)}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
          {user?.profile?.title || <Skeleton width="80%" />}
        </Typography>

        <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
          {t('user:bio')}:
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {user?.profile?.bio || <Skeleton width="80%" />}
        </Typography>

        <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
          {t('user:short_bio')}:
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {user?.profile?.shortBio || <Skeleton width="80%" />}
        </Typography>
      </SectionCard>

      <EditAboutDialog
        user={user}
        open={openAbout}
        onClose={() => setOpenAbout(false)}
        onSave={handleSaveAbout}
        loading={loading}
      />

      {/* Company Information Section */}
      <SectionCard
        title="Company Information"
        readOnly={readOnly}
        onEdit={() => setOpenCompany(true)}
      >
        <Stack spacing={1}>
          {user?.client?.companyName && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Company Name
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.client.companyName}
              </Typography>
            </Box>
          )}

          {user?.client?.industry && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Industry
              </Typography>
              <Chip label={user.client.industry} size="medium" variant="outlined" color="primary" />
            </Box>
          )}

          {user?.client?.companySize && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Company Size
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.client.companySize}
              </Typography>
            </Box>
          )}

          {user?.client?.websiteUrl && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Website
              </Typography>
              <Link href={user.client.websiteUrl} target="_blank" rel="noopener noreferrer">
                <Typography variant="body1" color="primary" sx={{ textDecoration: 'none' }}>
                  {user.client.websiteUrl}
                </Typography>
              </Link>
            </Box>
          )}
        </Stack>
      </SectionCard>

      <EditCompanyDialog
        user={user}
        open={openCompany}
        onClose={() => setOpenCompany(false)}
        onSave={handleSaveCompany}
        loading={loading}
      />

      {/* Billing Information Section */}
      <SectionCard
        title="Billing Information"
        readOnly={readOnly}
        onEdit={() => setOpenBilling(true)}
      >
        <Stack spacing={1}>
          {user?.client?.billingStreet && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Billing Address
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.client.billingStreet}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.client.billingCity}, {user.client.billingState}{' '}
                {user.client.billingPostalCode}
              </Typography>
              <Typography variant="body1">{user.client.billingCountry}</Typography>
            </Box>
          )}

          {user?.client?.taxIdentifier && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Tax Identifier
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.client.taxIdentifier}
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>

      <EditBillingDialog
        user={user}
        open={openBilling}
        onClose={() => setOpenBilling(false)}
        onSave={handleSaveBilling}
        loading={loading}
      />

      {/* Budget & Project Information Section */}
      <SectionCard
        title="Budget & Projects"
        readOnly={readOnly}
        onEdit={() => setOpenBudgetProjects(true)}
      >
        <Stack spacing={1}>
          {user?.client?.budget && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Budget Range
              </Typography>
              <Chip
                label={user.client.budget}
                size="medium"
                variant="outlined"
                color="secondary"
                icon={<AttachMoney />}
              />
            </Box>
          )}

          {user?.client?.projectCount !== undefined && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Total Projects
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {user.client.projectCount}
              </Typography>
            </Box>
          )}

          {user?.client?.preferredCreators && user.client.preferredCreators.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Preferred Creators
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.client.preferredCreators.length} creator(s) selected
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>
      <EditBudgetProjectsDialog
        user={user}
        open={openBudgetProjects}
        onClose={() => setOpenBudgetProjects(false)}
        onSave={handleSaveBudgetProjects}
        loading={loading}
      />

      {/* Default Project Settings Section */}
      <SectionCard
        title="Default Project Settings"
        readOnly={readOnly}
        onEdit={() => setOpenDefaultProjectSettings(true)}
      >
        <Stack spacing={1}>
          {user?.client?.defaultProjectSettings ? (
            <Stack spacing={1}>
              {user.client.defaultProjectSettings.notificationFrequency && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    Notification Frequency:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user.client.defaultProjectSettings.notificationFrequency}
                  </Typography>
                </Box>
              )}

              {user.client.defaultProjectSettings.timeline && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    Timeline:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user.client.defaultProjectSettings.timeline}
                  </Typography>
                </Box>
              )}

              {user.client.defaultProjectSettings.communicationPreference && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    Communication Preference:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user.client.defaultProjectSettings.communicationPreference}
                  </Typography>
                </Box>
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
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No default project settings configured yet.
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>
      <EditDefaultProjectSettingsDialog
        user={user}
        open={openDefaultProjectSettings}
        onClose={() => setOpenDefaultProjectSettings(false)}
        onSave={handleSaveDefaultProjectSettings}
        loading={loading}
      />

      {/* Contact Information Section */}
      <SectionCard
        title="Contact Information"
        readOnly={readOnly}
        onEdit={() => setOpenContactInfo(true)}
      >
        <Stack spacing={1}>
          {user?.profile?.contactPhone && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Phone Number
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.profile.contactPhone}
              </Typography>
            </Box>
          )}

          {user?.profile?.contactEmail && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Email Address
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.profile.contactEmail}
              </Typography>
            </Box>
          )}

          {user?.profile?.city && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Location
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.profile.city}
                {user.profile.country ? `, ${user.profile.country}` : ''}
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>
      <EditContactInfoDialog
        user={user}
        open={openContactInfo}
        onClose={() => setOpenContactInfo(false)}
        onSave={handleSaveContactInfo}
        loading={loading}
      />

      {/* Additional Information Section */}
      <SectionCard title="Additional Information" readOnly={readOnly}>
        <Stack spacing={1}>
          {user?.profile?.preferredLanguage && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Preferred Language
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.profile.preferredLanguage}
              </Typography>
            </Box>
          )}

          {user?.profile?.timezone && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Timezone
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.profile.timezone}
              </Typography>
            </Box>
          )}

          {user?.dateRegistered && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Member Since
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {new Date(user.dateRegistered).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>
    </Stack>
  );
};

export default ClientMainContent;
