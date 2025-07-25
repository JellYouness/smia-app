import React from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import { LinkedIn, Twitter, Facebook, Instagram, GitHub, Edit } from '@mui/icons-material';
import Link from 'next/link';

interface SocialMediaLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
}

interface UserSocialMediaProps {
  socialMediaLinks: SocialMediaLinks;
  onEdit?: () => void;
  editable?: boolean;
  fallbackText?: string;
}

const UserSocialMedia: React.FC<UserSocialMediaProps> = ({
  socialMediaLinks,
  onEdit,
  editable = false,
  fallbackText = 'No social media links added yet',
}) => {
  const hasLinks = Object.values(socialMediaLinks).some(Boolean);
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Social Media
          </Typography>
        </Box>
        {editable && onEdit && (
          <IconButton size="small" onClick={onEdit} sx={{ color: 'primary.main' }}>
            <Edit sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
      <Stack spacing={1}>
        {hasLinks ? (
          <>
            {socialMediaLinks.linkedin && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkedIn sx={{ fontSize: 20, color: '#0077b5' }} />
                <Link href={socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    LinkedIn
                  </Typography>
                </Link>
              </Box>
            )}
            {socialMediaLinks.twitter && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Twitter sx={{ fontSize: 20, color: '#1DA1F2' }} />
                <Link href={socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    Twitter
                  </Typography>
                </Link>
              </Box>
            )}
            {socialMediaLinks.facebook && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Facebook sx={{ fontSize: 20, color: '#1877F2' }} />
                <Link href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    Facebook
                  </Typography>
                </Link>
              </Box>
            )}
            {socialMediaLinks.instagram && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Instagram sx={{ fontSize: 20, color: '#E4405F' }} />
                <Link href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    Instagram
                  </Typography>
                </Link>
              </Box>
            )}
            {socialMediaLinks.github && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GitHub sx={{ fontSize: 20, color: '#333' }} />
                <Link href={socialMediaLinks.github} target="_blank" rel="noopener noreferrer">
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                    GitHub
                  </Typography>
                </Link>
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {fallbackText}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default UserSocialMedia;
