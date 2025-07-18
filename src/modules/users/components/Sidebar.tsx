import React, { useState } from 'react';
import { Box, Stack, Typography, Chip, Skeleton, Divider, IconButton } from '@mui/material';
import {
  Work,
  Star,
  Verified,
  AttachMoney,
  LinkedIn,
  Twitter,
  Facebook,
  Instagram,
  GitHub,
  Language as LanguageIcon,
  School,
  Edit,
} from '@mui/icons-material';
import Link from 'next/link';
import { Any } from '@common/defs/types';
import JsonDataRenderer from './JsonDataRenderer';
import ProfilePicture from './ProfilePicture';
import EditSectionDialog from './EditSectionDialog';
import EditLanguagesDialog from '@modules/creators/components/EditLanguagesDialog';
import EditEducationDialog from '@modules/creators/components/EditEducationDialog';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';

interface Language {
  language: string;
  proficiency: string;
}

interface SidebarProps {
  user: Any;
  profilePicture: string | null;
  handleUploadPicture: (file: File) => Promise<void>;
  handleDeletePicture: () => Promise<void>;
}

const Sidebar = ({
  user,
  profilePicture,
  handleUploadPicture,
  handleDeletePicture,
}: SidebarProps) => {
  const [openLanguages, setOpenLanguages] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [loading, setLoading] = useState(false);

  const { updateLanguages, updateEducation } = useProfileUpdates();

  // Remove parseJsonData and parseLanguagesData
  const languagesData = user?.creator?.languages || [];
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
          <Stack spacing={1}>
            <JsonDataRenderer
              data={languagesData}
              renderItem={(lang, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {lang.language}
                  </Typography>
                  <Chip
                    label={lang.proficiency}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              )}
              fallback={
                <Typography variant="body2" color="text.secondary">
                  No languages added yet
                </Typography>
              }
            />
          </Stack>
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
            <JsonDataRenderer
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
            />
          </Stack>
        </Box>

        <Divider />

        {/* Social Media Links */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Social Media
          </Typography>
          <Stack spacing={1}>
            {user?.profile?.socialMediaLinks?.linkedin && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkedIn sx={{ fontSize: 20, color: '#0077b5' }} />
                <Link
                  href={user.profile.socialMediaLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    LinkedIn
                  </Typography>
                </Link>
              </Box>
            )}
            {user?.profile?.socialMediaLinks?.twitter && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Twitter sx={{ fontSize: 20, color: '#1DA1F2' }} />
                <Link
                  href={user.profile.socialMediaLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    Twitter
                  </Typography>
                </Link>
              </Box>
            )}
            {user?.profile?.socialMediaLinks?.facebook && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Facebook sx={{ fontSize: 20, color: '#1877F2' }} />
                <Link
                  href={user.profile.socialMediaLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    Facebook
                  </Typography>
                </Link>
              </Box>
            )}
            {user?.profile?.socialMediaLinks?.instagram && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Instagram sx={{ fontSize: 20, color: '#E4405F' }} />
                <Link
                  href={user.profile.socialMediaLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    Instagram
                  </Typography>
                </Link>
              </Box>
            )}
            {user?.profile?.socialMediaLinks?.github && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GitHub sx={{ fontSize: 20, color: '#333' }} />
                <Link
                  href={user.profile.socialMediaLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    GitHub
                  </Typography>
                </Link>
              </Box>
            )}
            {!user?.profile?.socialMediaLinks?.linkedin &&
              !user?.profile?.socialMediaLinks?.twitter &&
              !user?.profile?.socialMediaLinks?.facebook &&
              !user?.profile?.socialMediaLinks?.instagram &&
              !user?.profile?.socialMediaLinks?.github && (
                <Typography variant="body2" color="text.secondary">
                  No social media links added yet
                </Typography>
              )}
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
    </>
  );
};

export default Sidebar;
