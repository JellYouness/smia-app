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
  socialMediaLinks: SocialMediaLinks;
  onEdit?: () => void;
  readOnly?: boolean;
}

const UserSocialMedia: React.FC<UserSocialMediaProps> = ({
  socialMediaLinks,
  onEdit,
  readOnly = false,
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  socialMediaLinks = socialMediaLinks[0];
  return (
    <SectionCard title="Social Media" readOnly={readOnly} onEdit={onEdit} titleSize="h5">
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkedIn sx={{ fontSize: 20, color: '#0077b5' }} />
          {socialMediaLinks.linkedin ? (
            <Link href={socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <Typography
                variant="body2"
                color={socialMediaLinks.linkedin ? 'primary' : 'text.secondary'}
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
          {socialMediaLinks.twitter ? (
            <Link href={socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer">
              <Typography
                variant="body2"
                color={socialMediaLinks.twitter ? 'primary' : 'text.secondary'}
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
          {socialMediaLinks.facebook ? (
            <Link href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
              <Typography
                variant="body2"
                color={socialMediaLinks.facebook ? 'primary' : 'text.secondary'}
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
        {socialMediaLinks.instagram && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Instagram sx={{ fontSize: 20, color: '#E4405F' }} />
            <Link href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
              <Typography
                variant="body2"
                color={socialMediaLinks.instagram ? 'primary' : 'text.secondary'}
                sx={{ textDecoration: 'none' }}
              >
                Instagram
              </Typography>
            </Link>
          </Box>
        )}

        {socialMediaLinks.github && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GitHub sx={{ fontSize: 20, color: '#333' }} />
            <Link href={socialMediaLinks.github} target="_blank" rel="noopener noreferrer">
              <Typography
                variant="body2"
                color={socialMediaLinks.github ? 'primary' : 'text.secondary'}
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
