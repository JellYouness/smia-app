import React from 'react';
import { Box, Stack, Typography, Chip } from '@mui/material';
import { LocationOn, Web } from '@mui/icons-material';
import Link from 'next/link';
import { Any } from '@common/defs/types';

interface SidebarCompanyInfoSectionProps {
  user: Any;
}

const SidebarCompanyInfoSection = ({ user }: SidebarCompanyInfoSectionProps) => (
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
);

export default SidebarCompanyInfoSection;
