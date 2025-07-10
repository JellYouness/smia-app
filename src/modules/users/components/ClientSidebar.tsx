import React, { useState } from 'react';
import { Box, Stack, Typography, Chip, Skeleton, Divider, IconButton } from '@mui/material';
import {
  Business,
  AttachMoney,
  Language as LanguageIcon,
  School,
  Edit,
  LocationOn,
  Web,
  AccountBalance,
} from '@mui/icons-material';
import Link from 'next/link';
import { Any } from '@common/defs/types';
import JsonDataRenderer from './JsonDataRenderer';
import ProfilePicture from './ProfilePicture';
import EditSectionDialog from './EditSectionDialog';
import EditLanguagesDialog from './EditLanguagesDialog';
import EditEducationDialog from './EditEducationDialog';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';

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
  const [openEducation, setOpenEducation] = useState(false);
  const [loading, setLoading] = useState(false);

  const { updateLanguages, updateEducation } = useProfileUpdates();

  const languagesData = user?.client?.languages || [];
  const educationData = user?.client?.education || [];

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
        <Box sx={{ p: 2 }}>
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
          <Stack spacing={1}>
            {languagesData.length > 0 ? (
              languagesData.map((lang: Language, index: number) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LanguageIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {lang.language} - {lang.proficiency}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No languages added yet
              </Typography>
            )}
          </Stack>
        </Box>

        <Divider />

        {/* Education Section */}
        <Box sx={{ p: 2 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Education
            </Typography>
            <IconButton size="small" onClick={() => setOpenEducation(true)}>
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Stack spacing={1}>
            {educationData.length > 0 ? (
              educationData.map((edu: Any, index: number) => (
                <Box key={index}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {edu.institution}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.degree} - {edu.field}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {edu.startYear} - {edu.endYear}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No education added yet
              </Typography>
            )}
          </Stack>
        </Box>

        <Divider />

        {/* Social Media Section */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Social Media
          </Typography>
          <Stack spacing={1}>
            {user?.profile?.socialMediaLinks?.linkedin && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#0077b5', borderRadius: 1 }} />
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
                <Box sx={{ width: 20, height: 20, bgcolor: '#1DA1F2', borderRadius: 1 }} />
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
                <Box sx={{ width: 20, height: 20, bgcolor: '#1877F2', borderRadius: 1 }} />
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
            {!user?.profile?.socialMediaLinks?.linkedin &&
              !user?.profile?.socialMediaLinks?.twitter &&
              !user?.profile?.socialMediaLinks?.facebook && (
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

export default ClientSidebar;
