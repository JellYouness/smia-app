import { MediaPostAsset } from '../../../defs/types';
import { Box, Stack, Typography } from '@mui/material';
import { AttachFile } from '@mui/icons-material';

interface MediaAssetsProps {
  assets: MediaPostAsset[];
}

const MediaAssets = ({ assets }: MediaAssetsProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mb: 2, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}
      >
        Assets ({assets.length})
      </Typography>
      <Stack spacing={1}>
        {assets.map((asset, idx) => (
          <Box
            key={asset.id || idx}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#fafbfc',
              '&:hover': { background: '#f3f4f6' },
            }}
          >
            <AttachFile sx={{ fontSize: '20px', color: 'text.secondary' }} />
            <Typography variant="body2" color="text.primary">
              Asset Version {asset.version}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default MediaAssets;
