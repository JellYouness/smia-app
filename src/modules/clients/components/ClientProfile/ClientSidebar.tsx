import React, { useState } from 'react';
import { Stack, Divider } from '@mui/material';
import { Any } from '@common/defs/types';
import EditLanguagesDialog from '@modules/creators/components/CreatorProfle/EditLanguagesDialog';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';
import EditSocialMediaDialog from './EditSocialMediaDialog';
import SidebarProfileHeaderSection from './proflle-components/SidebarProfileHeaderSection';
import SidebarLanguagesSection from './proflle-components/SidebarLanguagesSection';
import SidebarSocialMediaSection from './proflle-components/SidebarSocialMediaSection';
import useAuth from '@modules/auth/hooks/api/useAuth';

interface Language {
  language: string;
  proficiency: string;
}

interface ClientSidebarProps {
  user: Any;
  profilePicture: string | null;
  handleUploadPicture: (file: File) => Promise<void>;
  handleDeletePicture: () => Promise<void>;
  readOnly?: boolean;
}

const ClientSidebar = ({
  user,
  profilePicture,
  handleUploadPicture,
  handleDeletePicture,
  readOnly,
}: ClientSidebarProps) => {
  const [openLanguages, setOpenLanguages] = useState(false);
  const [openSocialMedia, setOpenSocialMedia] = useState(false);
  const [loading, setLoading] = useState(false);

  const { updateClientLanguages, updateSocialMedia } = useProfileUpdates();

  const { mutate } = useAuth();

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
        mutate();
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
        mutate();
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
        <SidebarProfileHeaderSection
          user={user}
          profilePicture={profilePicture}
          handleUploadPicture={handleUploadPicture}
          handleDeletePicture={handleDeletePicture}
          readOnly={readOnly}
        />
        <Divider />
        {/* <SidebarCompanyInfoSection user={user} />
        <Divider /> */}
        <SidebarLanguagesSection
          languagesData={languagesData}
          onEdit={() => setOpenLanguages(true)}
          readOnly={readOnly}
        />
        <Divider />
        <SidebarSocialMediaSection
          user={user}
          onEdit={() => setOpenSocialMedia(true)}
          readOnly={readOnly}
        />
      </Stack>
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
