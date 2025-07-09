import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    {icon}
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Stack>
);

export default InfoItem;
