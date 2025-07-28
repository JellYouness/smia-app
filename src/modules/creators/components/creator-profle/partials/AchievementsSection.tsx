import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { Star, EmojiEventsOutlined } from '@mui/icons-material';
import { TFunction } from 'next-i18next';
import { Creator } from '@modules/creators/defs/types';

interface AchievementsSectionProps {
  creator: Creator;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const AchievementsSection = ({ creator, t, readOnly, onEdit }: AchievementsSectionProps) => (
  <SectionCard title={t('user:achievements') || 'Achievements'} readOnly={readOnly} onEdit={onEdit}>
    <Stack spacing={2}>
      {creator.achievements && creator.achievements.length > 0 ? (
        creator.achievements.map((achievement: string, index: number) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2.5,
              pl: 3,
              bgcolor: 'grey.50',
              borderLeft: '6px solid',
              borderColor: 'warning.main',
              borderRadius: '0 16px 16px 0',
              boxShadow: 0,
              gap: 2,
              position: 'relative',
              minHeight: 56,
              '&:hover': {
                boxShadow: 2,
                bgcolor: 'background.paper',
                borderColor: 'warning.dark',
                transition: 'all 0.2s',
                '& .MuiSvgIcon-root': {
                  color: 'warning.dark',
                },
              },
            }}
          >
            <Star sx={{ color: 'warning.main', fontSize: 28, mr: 2, flexShrink: 0 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {achievement}
            </Typography>
          </Box>
        ))
      ) : (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'grey.50',
          }}
        >
          <EmojiEventsOutlined sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            {t('user:highlight_achievements')}
          </Typography>
        </Box>
      )}
    </Stack>
  </SectionCard>
);

export default AchievementsSection;
