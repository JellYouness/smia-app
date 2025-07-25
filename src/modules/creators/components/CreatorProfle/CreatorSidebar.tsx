import React, { useState } from 'react';
import { Box, Stack, Typography, Divider, IconButton } from '@mui/material';
import { School, Edit } from '@mui/icons-material';
import { Any } from '@common/defs/types';
import EditLanguagesDialog from '@modules/creators/components/CreatorProfle/EditLanguagesDialog';
import EditEducationDialog from '@modules/creators/components/CreatorProfle/EditEducationDialog';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';
import EditSocialMediaDialog from '@modules/clients/components/ClientProfile/EditSocialMediaDialog';
import UserProfileHeader from '@common/components/UserProfileHeader';
import UserLanguages from '@common/components/UserLanguages';
import UserSocialMedia from '@common/components/UserSocialMedia';

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
      <Stack spacing={1}>
        <UserProfileHeader
          profilePicture={profilePicture}
          firstName={user?.firstName}
          lastName={user?.lastName}
          city={user?.profile?.city}
          country={user?.profile?.country}
          onUploadPicture={handleUploadPicture}
          onDeletePicture={handleDeletePicture}
          userRole="creator"
          user={user}
        />
        <Divider />
        <UserLanguages languages={languagesData} onEdit={() => setOpenLanguages(true)} editable />
        <Divider />
        {/* Education Section remains as is */}
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
          </Stack>
        </Box>
        <Divider />
        <UserSocialMedia
          socialMediaLinks={user?.profile?.socialMediaLinks || {}}
          onEdit={() => setOpenSocialMedia(true)}
          editable
        />
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
