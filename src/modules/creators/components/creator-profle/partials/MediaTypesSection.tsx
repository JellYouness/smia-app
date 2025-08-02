import React from 'react';
import { Box, Stack, Typography, Chip } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { PermMediaOutlined } from '@mui/icons-material';
import { TFunction } from 'next-i18next';
import { Creator } from '@modules/creators/defs/types';

interface MediaTypesSectionProps {
  creator: Creator;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
  titleSize?: 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1';
}

const MediaTypesSection = ({ creator, t, readOnly, onEdit, titleSize }: MediaTypesSectionProps) => (
  <SectionCard
    title={t('user:media_types') || 'Media Types'}
    readOnly={readOnly}
    onEdit={onEdit}
    titleSize={titleSize}
  >
    <Stack
      direction="row"
      spacing={1}
      sx={{
        flexWrap: 'wrap',
        gap: 1,
        minHeight: 52,
        alignItems: 'center',
        py: 0.5,
      }}
    >
      {creator.mediaTypes?.length > 0 ? (
        creator.mediaTypes?.map((mediaType: string, index: number) => (
          <Chip
            key={index}
            label={mediaType}
            size="small"
            variant="outlined"
            color="primary" // Changed to secondary for media types
            sx={{
              '&.MuiChip-root': {
                borderRadius: 4, // Pill shape
                borderWidth: 1,
                fontWeight: 500,
                backgroundColor: 'white',
                '& .MuiChip-label': {
                  px: 1.5,
                  fontSize: '0.75rem',
                },
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                },
              },
            }}
          />
        ))
      ) : (
        <Box
          sx={{
            p: 3,
            width: '100%',
            textAlign: 'center',
            border: '1.5px dashed',
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: 'background.default',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'secondary.main',
              bgcolor: 'action.hover',
              '& .media-icon, & .media-text': {
                color: 'secondary.main',
              },
            },
          }}
        >
          <PermMediaOutlined
            className="media-icon"
            sx={{
              fontSize: 36,
              color: 'text.disabled',
              mb: 1.5,
              transition: 'inherit',
            }}
          />
          <Typography
            className="media-text"
            variant="body2"
            color="text.disabled"
            sx={{
              transition: 'inherit',
              fontWeight: 500,
            }}
          >
            {t('user:add_media_types')}
          </Typography>
        </Box>
      )}
    </Stack>
  </SectionCard>
);

export default MediaTypesSection;
