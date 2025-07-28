import React from 'react';
import { Box, Stack, Typography, Chip } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { WorkOutline } from '@mui/icons-material';
import { TFunction } from 'next-i18next';
import { Creator } from '@modules/creators/defs/types';

interface SkillsSectionProps {
  creator: Creator;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const SkillsSection = ({ creator, t, readOnly, onEdit }: SkillsSectionProps) => (
  <SectionCard title={t('user:skills') || 'Skills'} readOnly={readOnly} onEdit={onEdit}>
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        flexWrap: 'wrap',
        gap: 1.5,
        '& > *': {
          marginLeft: '0 !important', // Override spacing for wrapped items
        },
      }}
    >
      {creator.skills?.length > 0 ? (
        creator.skills?.map((skill: string, index: number) => (
          <Chip
            key={index}
            label={skill}
            size="medium"
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: 3,
              fontWeight: 500,
              fontSize: '0.875rem',
              height: 32,
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
              borderColor: 'primary.main',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
              },
              '& .MuiChip-label': {
                px: 2,
                color: 'primary.main',
              },
            }}
          />
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
            width: '100%',
            minHeight: 180,
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
              p: 2,
              borderRadius: '50%',
              bgcolor: 'rgba(158, 158, 158, 0.1)',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WorkOutline
              sx={{
                fontSize: 48,
                color: 'text.secondary',
              }}
            />
          </Box>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            {t('user:no_skills_added_yet')}
          </Typography>
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{
              fontSize: '0.8rem',
            }}
          >
            Add skills to showcase your expertise
          </Typography>
        </Box>
      )}
    </Stack>
  </SectionCard>
);

export default SkillsSection;
