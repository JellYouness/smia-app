import React, { useState } from 'react';
import { Stack } from '@mui/material';
import { Any } from '@common/defs/types';
import EditLanguagesDialog from '@modules/creators/components/creator-profle/dialogs/EditLanguagesDialog';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';
import EditSocialMediaDialog from './dialogs/EditSocialMediaDialog';
import SidebarSocialMediaSection from './proflle-components/SidebarSocialMediaSection';
import useAuth from '@modules/auth/hooks/api/useAuth';
import UserLanguages from '@common/components/UserLanguages';

interface Language {
  language: string;
  proficiency: string;
}

interface ClientSidebarProps {
  user: Any;
  readOnly?: boolean;
}

const ClientSidebar = ({ user, readOnly }: ClientSidebarProps) => {
  const [openLanguages, setOpenLanguages] = useState(false);
  const [openSocialMedia, setOpenSocialMedia] = useState(false);
  const [loading, setLoading] = useState(false);

  const { updateClientLanguages, updateSocialMedia } = useProfileUpdates();

  const { mutate } = useAuth();

  const languagesData: Language[] = user?.client?.languages || [];

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
        <UserLanguages
          languages={languagesData}
          onEdit={() => setOpenLanguages(true)}
          readOnly={readOnly}
          titleSize="h5"
        />
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
