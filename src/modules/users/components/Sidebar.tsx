import React from 'react';
import { Box, Card, Stack, Typography, Chip, Skeleton } from '@mui/material';
import {
  Work,
  Star,
  Verified,
  LinkedIn,
  Twitter,
  Facebook,
  Instagram,
  GitHub,
  Language as LanguageIcon,
  School,
} from '@mui/icons-material';
import Link from 'next/link';
import { Any } from '@common/defs/types';
import { JsonDataRenderer, ProfilePicture } from '@modules/users/components';

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
}: SidebarProps) => (
  <Stack spacing={3}>
    <Card sx={{ p: 3, textAlign: 'center' }}>
      <ProfilePicture
        src={profilePicture}
        onUpload={handleUploadPicture}
        onDelete={handleDeletePicture}
      />
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
        {user?.firstName} {user?.lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {user?.profile?.city || <Skeleton width={80} />}{' '}
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
    </Card>

    {/* Languages Section */}
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <LanguageIcon sx={{ fontSize: 20, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Languages
        </Typography>
      </Box>
      <Stack spacing={1}>
        <JsonDataRenderer
          data={user?.creator?.languages || []}
          renderItem={(lang, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {lang.language}
              </Typography>
              <Chip label={lang.proficiency} size="small" color="secondary" variant="outlined" />
            </Box>
          )}
          fallback={
            <Typography variant="body2" color="text.secondary">
              No languages added yet
            </Typography>
          }
        />
      </Stack>
    </Card>

    {/* Education Section */}
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <School sx={{ fontSize: 20, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Education
        </Typography>
      </Box>
      <Stack spacing={2}>
        <JsonDataRenderer
          data={user?.creator?.education || []}
          renderItem={(edu, index) => (
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
          )}
          fallback={
            <Typography variant="body2" color="text.secondary">
              No education added yet
            </Typography>
          }
        />
      </Stack>
    </Card>

    {/* Social Media Links */}
    <Card sx={{ p: 3 }}>
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
    </Card>
  </Stack>
);

export default Sidebar;
