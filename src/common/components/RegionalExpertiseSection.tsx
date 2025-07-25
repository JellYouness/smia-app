import React from 'react';
import { Box, Stack, Typography, Chip } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { MapOutlined } from '@mui/icons-material';
import { TFunction } from 'next-i18next';
import { Creator, RegionalExpertise } from '@modules/creators/defs/types';

interface RegionalExpertiseSectionProps {
  creator: Creator;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
  titleSize?: 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1';
}

const RegionalExpertiseSection = ({
  creator,
  t,
  readOnly,
  onEdit,
  titleSize,
}: RegionalExpertiseSectionProps) => (
  <SectionCard
    title={t('user:regional_expertise') || 'Regional Expertise'}
    readOnly={readOnly}
    onEdit={onEdit}
    titleSize={titleSize}
  >
    <Stack spacing={2.5}>
      {creator.regionalExpertise?.length > 0 ? (
        creator.regionalExpertise?.map((expertise: RegionalExpertise, index: number) => (
          <Box
            key={index}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.12)',
                transform: 'translateY(-2px)',
                '&::before': {
                  opacity: 1,
                },
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '1.1rem',
                    lineHeight: 1.2,
                  }}
                >
                  {expertise.region}
                </Typography>
              </Box>

              <Chip
                label={expertise.expertiseLevel}
                size="small"
                color="primary"
                variant="filled"
                sx={{
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: 24,
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiChip-label': {
                    px: 1.5,
                  },
                }}
              />
            </Box>
          </Box>
        ))
      ) : (
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 4,
            bgcolor: 'grey.50',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.light',
              bgcolor: 'rgba(25, 118, 210, 0.02)',
            },
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: '50%',
              bgcolor: 'rgba(158, 158, 158, 0.1)',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapOutlined
              sx={{
                fontSize: 52,
                color: 'text.secondary',
              }}
            />
          </Box>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              mb: 1,
            }}
          >
            {t('user:no_regional_expertise')}
          </Typography>

          <Typography
            variant="body2"
            color="text.disabled"
            sx={{
              fontSize: '0.875rem',
              maxWidth: 300,
              lineHeight: 1.5,
            }}
          >
            Showcase your knowledge of specific regions and markets
          </Typography>
        </Box>
      )}
    </Stack>
  </SectionCard>
);

export default RegionalExpertiseSection;
