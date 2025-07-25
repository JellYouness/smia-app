import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { BusinessCenterOutlined } from '@mui/icons-material';
import { TFunction } from 'next-i18next';
import { Creator, ProfessionalBackground } from '@modules/creators/defs/types';

interface ProfessionalBackgroundSectionProps {
  creator: Creator;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const ProfessionalBackgroundSection = ({
  creator,
  t,
  readOnly,
  onEdit,
}: ProfessionalBackgroundSectionProps) => (
  <SectionCard
    title={t('user:professional_background') || 'Professional Background'}
    readOnly={readOnly}
    onEdit={onEdit}
  >
    <Stack spacing={3}>
      {creator.professionalBackground && creator.professionalBackground.length > 0 ? (
        creator.professionalBackground.map((job: ProfessionalBackground, index: number) => (
          <Box
            key={index}
            sx={{
              p: 3,
              border: '1px solid',
              borderLeft: '6px solid',
              borderColor: 'primary.main',
              borderRadius: 2,
              bgcolor: 'background.paper',
              position: 'relative',
              '&:hover': {
                borderColor: 'primary.dark',
                boxShadow: 1,
              },
            }}
          >
            <Box sx={{ pl: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                {job.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                {job.company} • {job.duration}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {job.description}
              </Typography>
            </Box>
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
          <BusinessCenterOutlined sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            {t('user:add_employment_history')}
          </Typography>
        </Box>
      )}
    </Stack>
  </SectionCard>
);

export default ProfessionalBackgroundSection;
