import React, { useState } from 'react';
import { Box, Stack, Typography, Divider, Button, LinearProgress } from '@mui/material';
import { Business } from '@mui/icons-material';
import { Any } from '@common/defs/types';
import EditLanguagesDialog from '@modules/creators/components/creator-profle/dialogs/EditLanguagesDialog';
import EditEducationDialog from '@modules/creators/components/creator-profle/dialogs/EditEducationDialog';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';
import EditSocialMediaDialog from '@modules/clients/components/client-profile/dialogs/EditSocialMediaDialog';
import UserLanguages from '@common/components/UserLanguages';
import UserSocialMedia from '@common/components/UserSocialMedia';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { ApplyForAmbassadorDialog } from '@modules/ambassadors/components/dialogs';
import useApplyForAmbassador from '@modules/ambassadors/hooks/useApplyForAmbassador';
import { useTranslation } from 'react-i18next';
import { User } from '@modules/users/defs/types';
import SectionCard from '@modules/users/components/SectionCard';

interface CreatorSidebarProps {
  user: User;
  readOnly?: boolean;
}

const CreatorSidebar = ({ user, readOnly }: CreatorSidebarProps) => {
  const [openLanguages, setOpenLanguages] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openSocialMedia, setOpenSocialMedia] = useState(false);
  const [openAmbassadorApplication, setOpenAmbassadorApplication] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['user', 'common']);

  const { updateLanguages, updateEducation, updateSocialMedia } = useProfileUpdates();
  const { applyForAmbassador } = useApplyForAmbassador();

  const { mutate } = useAuth();

  const progressBarColor = () => {
    if (!user?.profile?.profileCompleteness) {
      return 'grey.200';
    }
    if (user?.profile?.profileCompleteness === 100) {
      return 'success.main';
    }
    if (user?.profile?.profileCompleteness >= 75) {
      return 'warning.main';
    }
    if (user?.profile?.profileCompleteness >= 50) {
      return 'info.main';
    }
    return 'error.main';
  };

  const languagesData = user?.creator?.languages || [];
  const educationData = user?.creator?.education || [];

  const handleSaveLanguages = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateLanguages(user.id, data);
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

  const handleSaveEducation = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateEducation(user.id, data);
      if (response.success) {
        setOpenEducation(false);
        mutate();
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
        mutate();
      }
    } catch (error) {
      console.error('Error saving social media data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForAmbassador = async (data: Any) => {
    try {
      setLoading(true);
      const response = await applyForAmbassador(data);
      if (response.success) {
        setOpenAmbassadorApplication(false);
        mutate();
      }
    } catch (error) {
      console.error('Error applying for ambassador:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack
        spacing={1}
        //  sx={{ borderLeft: `2px solid`, borderColor: 'divider' }}
      >
        {user?.profile?.profileCompleteness !== undefined && (
          <Box sx={{ mb: 2, px: 3 }}>
            <Typography
              variant="caption"
              textAlign="center"
              sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5, display: 'block' }}
            >
              Profile Completeness
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={user.profile.profileCompleteness}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': { backgroundColor: progressBarColor() },
                }}
              />
              <Typography
                variant="body2"
                sx={{ minWidth: 36, fontWeight: 600, color: progressBarColor() }}
              >
                {Math.round(user.profile.profileCompleteness)}%
              </Typography>
            </Box>
          </Box>
        )}
        <Divider />
        <UserLanguages
          languages={languagesData}
          onEdit={() => setOpenLanguages(true)}
          readOnly={readOnly}
          titleSize="h5"
        />
        {/* Education Section remains as is */}
        <SectionCard
          title={t('user:education') || 'Education'}
          readOnly={readOnly}
          onEdit={() => setOpenEducation(true)}
          titleSize="h5"
        >
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
        </SectionCard>
        <UserSocialMedia
          socialMediaLinks={user?.profile?.socialMediaLinks || {}}
          onEdit={() => setOpenSocialMedia(true)}
          readOnly={readOnly}
        />

        {/* Ambassador Application Section */}
        {!user?.ambassador && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Business sx={{ fontSize: 20, color: 'primary.main' }} />
                {t('user:become_ambassador') || 'Become an Ambassador'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('user:ambassador_description') ||
                  'Apply to become an ambassador and expand your business opportunities.'}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setOpenAmbassadorApplication(true)}
                sx={{ mt: 1 }}
              >
                {t('user:apply_for_ambassador') || 'Apply for Ambassador Status'}
              </Button>
            </Box>
          </>
        )}
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

      {/* Ambassador Application Dialog */}
      <ApplyForAmbassadorDialog
        onSave={handleApplyForAmbassador}
        loading={loading}
        open={openAmbassadorApplication}
        onClose={() => setOpenAmbassadorApplication(false)}
        t={t}
      />
    </>
  );
};

export default CreatorSidebar;
