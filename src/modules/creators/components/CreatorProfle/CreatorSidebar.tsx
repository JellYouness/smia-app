import React, { useState } from 'react';
import { Box, Stack, Typography, Skeleton, Divider, IconButton } from '@mui/material';
import {
  Work,
  Star,
  Verified,
  AttachMoney,
  LinkedIn,
  Twitter,
  Facebook,
  Language as LanguageIcon,
  School,
  Edit,
} from '@mui/icons-material';
import Link from 'next/link';
import { Any } from '@common/defs/types';
import ProfilePicture from '@modules/users/components/ProfilePicture';
import EditLanguagesDialog from '@modules/creators/components/CreatorProfle/EditLanguagesDialog';
import EditEducationDialog from '@modules/creators/components/CreatorProfle/EditEducationDialog';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';
import LanguageChips from '@modules/projects/components/partials/LanguageChips';
import EditSocialMediaDialog from '@modules/clients/components/ClientProfile/EditSocialMediaDialog';

interface CreatorSidebarProps {
  user: Any;
  profilePicture: string | null;
  handleUploadPicture: (file: File) => Promise<void>;
  handleDeletePicture: () => Promise<void>;
}

const CreatorSidebar = ({
  user,
  profilePicture,
  handleUploadPicture,
  handleDeletePicture,
}: CreatorSidebarProps) => {
  const [openLanguages, setOpenLanguages] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openSocialMedia, setOpenSocialMedia] = useState(false);
  const [loading, setLoading] = useState(false);

  const { updateLanguages, updateEducation, updateSocialMedia } = useProfileUpdates();

  // Remove parseJsonData and parseLanguagesData
  let languagesData = [];
  if (user?.creator?.languages) {
    try {
      if (Array.isArray(user.creator.languages)) {
        languagesData = user.creator.languages;
      } else {
        languagesData = JSON.parse(user.creator.languages);
      }
    } catch {
      languagesData = [];
    }
  }
  const educationData = user?.creator?.education || [];

  const handleSaveLanguages = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateLanguages(user.id, data);
      if (response.success) {
        setOpenLanguages(false);
      }
    } catch (error) {
      console.error('Error saving languages data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEducation = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateEducation(user.id, data);
      if (response.success) {
        setOpenEducation(false);
      }
    } catch (error) {
      console.error('Error saving education data:', error);
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

          {/* Additional Info */}
          {user?.creator && (
            <Box sx={{ mt: 2 }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Verified sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.creator.verificationStatus}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Work sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.creator.experience} years experience
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    ${user.creator.hourlyRate}/hr
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.creator.averageRating} ({user.creator.ratingCount} reviews)
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Box>

        <Divider />

        {/* Languages Section */}
        <Box sx={{ p: 2 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Languages
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setOpenLanguages(true)}
              sx={{ color: 'primary.main' }}
            >
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <LanguageChips languages={languagesData} />
        </Box>

        <Divider />

        {/* Education Section */}
        <Box sx={{ p: 2 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Education
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setOpenEducation(true)}
              sx={{ color: 'primary.main' }}
            >
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Stack spacing={2}>
            {educationData.map((edu: Any, index: number) => (
              <Box key={index}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {edu.degree} in {edu.field}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {edu.institution}
                </Typography>
                {edu.year && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    {edu.year}
                  </Typography>
                )}
              </Box>
            ))}
            {/* <JsonDataRenderer
              data={educationData}
              renderItem={(edu, index) => (
                <Box key={index}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {edu.degree} in {edu.field}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {edu.institution}
                  </Typography>
                  {edu.year && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {edu.year}
                    </Typography>
                  )}
                </Box>
              )}
              fallback={
                <Typography variant="body2" color="text.secondary">
                  No education added yet
                </Typography>
              }
            /> */}
          </Stack>
        </Box>

        <Divider />

        {/* Social Media Links */}
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

      {/* Education Edit Dialog */}
      <EditEducationDialog
        open={openEducation}
        onClose={() => setOpenEducation(false)}
        onSave={handleSaveEducation}
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

export default CreatorSidebar;
