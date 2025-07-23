import React, { useState } from 'react';
import { Box, Stack, Typography, Chip, Skeleton, Divider, IconButton } from '@mui/material';
import {
  Business,
  AttachMoney,
  Edit,
  LocationOn,
  Web,
  AccountBalance,
  LinkedIn,
  Twitter,
  Facebook,
} from '@mui/icons-material';
import Link from 'next/link';
import { Any } from '@common/defs/types';
import ProfilePicture from '@modules/users/components/ProfilePicture';
import EditLanguagesDialog from '@modules/creators/components/CreatorProfle/EditLanguagesDialog';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';
import LanguageChips from '@modules/projects/components/partials/LanguageChips';
import EditSocialMediaDialog from './EditSocialMediaDialog';

interface Language {
  language: string;
  proficiency: string;
}

interface ClientSidebarProps {
  user: Any;
  profilePicture: string | null;
  handleUploadPicture: (file: File) => Promise<void>;
  handleDeletePicture: () => Promise<void>;
}

const ClientSidebar = ({
  user,
  profilePicture,
  handleUploadPicture,
  handleDeletePicture,
}: ClientSidebarProps) => {
  const [openLanguages, setOpenLanguages] = useState(false);
  const [openSocialMedia, setOpenSocialMedia] = useState(false);
  const [loading, setLoading] = useState(false);

  const { updateClientLanguages, updateSocialMedia } = useProfileUpdates();

  // Parse client languages JSON
  let languagesData: Language[] = [];
  if (user?.client?.languages) {
    try {
      if (Array.isArray(user.client.languages)) {
        languagesData = user.client.languages;
      } else {
        languagesData = JSON.parse(user.client.languages);
      }
    } catch {
      languagesData = [];
    }
  }

  const handleSaveLanguages = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateClientLanguages(user.id, data);
      if (response.success) {
        setOpenLanguages(false);
      }
    } catch (error) {
      console.error('Error saving languages data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSocialMedia = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateSocialMedia(user.id, data);
      if (response.success) {
        setOpenSocialMedia(false);
      }
    } catch (error) {
      console.error('Error saving social media data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <ProfilePicture
            src={profilePicture}
            onUpload={handleUploadPicture}
            onDelete={handleDeletePicture}
          />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.profile?.city || <Skeleton width={80} />}
            {user?.profile?.country ? `, ${user.profile.country}` : ''}
          </Typography>

          {/* Client-specific Info */}
          {user?.client && (
            <Box sx={{ mt: 2 }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.client.companyName || 'Company Name'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.client.companySize} Company
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.client.budget} Budget
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.client.projectCount} Projects
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Box>

        <Divider />

        {/* Company Information */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Company Information
          </Typography>
          <Stack spacing={2}>
            {user?.client?.websiteUrl && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Web sx={{ fontSize: 20, color: 'primary.main' }} />
                <Link href={user.client.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    Website
                  </Typography>
                </Link>
              </Box>
            )}
            {user?.client?.industry && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Industry
                </Typography>
                <Chip label={user.client.industry} size="small" variant="outlined" />
              </Box>
            )}
            {user?.client?.billingCity && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {user.client.billingCity}, {user.client.billingCountry}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        <Divider />

        {/* Languages Section */}
        <Box sx={{ p: 2, pt: 0 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Languages
            </Typography>
            <IconButton size="small" onClick={() => setOpenLanguages(true)}>
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <LanguageChips languages={languagesData} />
        </Box>

        <Divider />

        {/* Social Media Section */}
        <Box sx={{ p: 2, pt: 0 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Social Media
            </Typography>
            <IconButton size="small" onClick={() => setOpenSocialMedia(true)}>
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Stack spacing={1}>
            {/* LinkedIn */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkedIn
                color={user?.profile?.socialMediaLinks?.linkedin ? 'primary' : 'disabled'}
              />
              {user?.profile?.socialMediaLinks?.linkedin ? (
                <Link
                  href={user.profile.socialMediaLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    LinkedIn
                  </Typography>
                </Link>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  LinkedIn (Not added)
                </Typography>
              )}
            </Box>
            {/* Twitter */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Twitter color={user?.profile?.socialMediaLinks?.twitter ? 'primary' : 'disabled'} />
              {user?.profile?.socialMediaLinks?.twitter ? (
                <Link
                  href={user.profile.socialMediaLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    Twitter
                  </Typography>
                </Link>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Twitter (Not added)
                </Typography>
              )}
            </Box>
            {/* Facebook */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Facebook
                color={user?.profile?.socialMediaLinks?.facebook ? 'primary' : 'disabled'}
              />
              {user?.profile?.socialMediaLinks?.facebook ? (
                <Link
                  href={user.profile.socialMediaLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    Facebook
                  </Typography>
                </Link>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Facebook (Not added)
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      </Stack>

      {/* Languages Edit Dialog */}
      <EditLanguagesDialog
        open={openLanguages}
        onClose={() => setOpenLanguages(false)}
        onSave={handleSaveLanguages}
        loading={loading}
        user={user}
      />

      <EditSocialMediaDialog
        open={openSocialMedia}
        onClose={() => setOpenSocialMedia(false)}
        onSave={handleSaveSocialMedia}
        loading={loading}
        user={user}
      />
    </>
  );
};

export default ClientSidebar;
