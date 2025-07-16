import React, { useState } from 'react';
import { Box, Stack, Typography, Skeleton, Button, Chip } from '@mui/material';
import { Business, LocationOn, Web, AccountBalance, AttachMoney } from '@mui/icons-material';
import Link from 'next/link';
import { Any } from '@common/defs/types';
import SectionCard from '@common/components/SectionCard';
import EditAboutDialog from '@modules/users/components/EditAboutDialog';
import EditCompanyDialog from '@modules/users/components/EditCompanyDialog';
import EditBillingDialog from '@modules/users/components/EditBillingDialog';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';

interface ClientMainContentProps {
  user: Any;
  t: Any;
}

const ClientMainContent = ({ user, t }: ClientMainContentProps) => {
  const [openAbout, setOpenAbout] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [openBilling, setOpenBilling] = useState(false);
  const [loading, setLoading] = useState(false);

  const { updateAbout, updateCompany, updateBilling } = useProfileUpdates();

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

  return (
    <Stack spacing={0}>
      {/* Title/About Section */}
      <SectionCard
        title={user?.profile?.title || t('user:about')}
        onEdit={() => setOpenAbout(true)}
      >
        <Typography variant="body1" sx={{ mt: 1 }}>
          {user?.profile?.bio || <Skeleton width="80%" />}
        </Typography>
      </SectionCard>

      {/* About Edit Dialog */}
      <EditAboutDialog
        user={user}
        onSave={handleSaveAbout}
        loading={loading}
        open={openAbout}
        onClose={() => setOpenAbout(false)}
      />

      {/* Company Information Section */}
      <SectionCard title="Company Information" onEdit={() => setOpenCompany(true)}>
        <Stack spacing={3}>
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

      {/* Company Edit Dialog */}
      <EditCompanyDialog
        user={user}
        onSave={handleSaveCompany}
        loading={loading}
        open={openCompany}
        onClose={() => setOpenCompany(false)}
      />

      {/* Billing Information Section */}
      <SectionCard title="Billing Information" onEdit={() => setOpenBilling(true)}>
        <Stack spacing={3}>
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

      {/* Billing Edit Dialog */}
      <EditBillingDialog
        user={user}
        onSave={handleSaveBilling}
        loading={loading}
        open={openBilling}
        onClose={() => setOpenBilling(false)}
      />

      {/* Budget & Project Information Section */}
      <SectionCard title="Budget & Projects">
        <Stack spacing={3}>
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

      {/* Default Project Settings Section */}
      <SectionCard title="Default Project Settings">
        <Stack spacing={3}>
          {user?.client?.defaultProjectSettings ? (
            <Stack spacing={2}>
              {user.client.defaultProjectSettings.budget && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    Default Budget
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    ${user.client.defaultProjectSettings.budget}
                  </Typography>
                </Box>
              )}

              {user.client.defaultProjectSettings.timeline && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    Default Timeline
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user.client.defaultProjectSettings.timeline}
                  </Typography>
                </Box>
              )}

              {user.client.defaultProjectSettings.requirements && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    Default Requirements
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user.client.defaultProjectSettings.requirements}
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

      {/* Contact Information Section */}
      <SectionCard title="Contact Information">
        <Stack spacing={3}>
          {user?.phoneNumber && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Phone Number
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.phoneNumber}
              </Typography>
            </Box>
          )}

          {user?.email && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Email Address
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.email}
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

      {/* Additional Information Section */}
      <SectionCard title="Additional Information">
        <Stack spacing={3}>
          {user?.preferredLanguage && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Preferred Language
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.preferredLanguage}
              </Typography>
            </Box>
          )}

          {user?.timezone && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Timezone
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.timezone}
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
