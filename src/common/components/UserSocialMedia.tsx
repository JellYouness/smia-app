import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { LinkedIn, Twitter, Facebook, Instagram, GitHub } from '@mui/icons-material';
import Link from 'next/link';
import SectionCard from '@modules/users/components/SectionCard';

interface SocialMediaLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
}

interface UserSocialMediaProps {
  socialMediaLinks: SocialMediaLinks[];
  onEdit?: () => void;
  readOnly?: boolean;
}

const UserSocialMedia: React.FC<UserSocialMediaProps> = ({
  socialMediaLinks,
  onEdit,
  readOnly = false,
}) => {
  return (
    <SectionCard title="Social Media" readOnly={readOnly} onEdit={onEdit} titleSize="h5">
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkedIn sx={{ fontSize: 20, color: '#0077b5' }} />
          {socialMediaLinks[0]?.linkedin ? (
            <Link href={socialMediaLinks[0]?.linkedin} target="_blank" rel="noopener noreferrer">
              <Typography
                variant="body2"
                color={socialMediaLinks[0]?.linkedin ? 'primary' : 'text.secondary'}
                sx={{ textDecoration: 'none' }}
              >
                LinkedIn
              </Typography>
            </Link>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
              LinkedIn
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Twitter sx={{ fontSize: 20, color: '#1DA1F2' }} />
          {socialMediaLinks[0]?.twitter ? (
            <Link href={socialMediaLinks[0]?.twitter} target="_blank" rel="noopener noreferrer">
              <Typography
                variant="body2"
                color={socialMediaLinks[0]?.twitter ? 'primary' : 'text.secondary'}
                sx={{ textDecoration: 'none' }}
              >
                Twitter
              </Typography>
            </Link>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Twitter
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Facebook sx={{ fontSize: 20, color: '#1877F2' }} />
          {socialMediaLinks[0]?.facebook ? (
            <Link href={socialMediaLinks[0]?.facebook} target="_blank" rel="noopener noreferrer">
              <Typography
                variant="body2"
                color={socialMediaLinks[0]?.facebook ? 'primary' : 'text.secondary'}
                sx={{ textDecoration: 'none' }}
              >
                Facebook
              </Typography>
            </Link>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Facebook
            </Typography>
          )}
        </Box>
        {socialMediaLinks[0]?.instagram && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Instagram sx={{ fontSize: 20, color: '#E4405F' }} />
            <Link href={socialMediaLinks[0]?.instagram} target="_blank" rel="noopener noreferrer">
              <Typography
                variant="body2"
                color={socialMediaLinks[0]?.instagram ? 'primary' : 'text.secondary'}
                sx={{ textDecoration: 'none' }}
              >
                Instagram
              </Typography>
            </Link>
          </Box>
        )}

        {socialMediaLinks[0]?.github && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GitHub sx={{ fontSize: 20, color: '#333' }} />
            <Link href={socialMediaLinks[0]?.github} target="_blank" rel="noopener noreferrer">
              <Typography
                variant="body2"
                color={socialMediaLinks[0]?.github ? 'primary' : 'text.secondary'}
                sx={{ textDecoration: 'none' }}
              >
                GitHub
              </Typography>
            </Link>
          </Box>
        )}
      </Stack>
    </SectionCard>
  );
};

export default UserSocialMedia;
