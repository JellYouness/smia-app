import React from 'react';
import { Box, Stack, Typography, Chip } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { DevicesOtherOutlined } from '@mui/icons-material';
import { TFunction } from 'next-i18next';
import { Creator } from '@modules/creators/defs/types';

interface EquipmentInfoSectionProps {
  creator: Creator;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const EquipmentInfoSection = ({ creator, t, readOnly, onEdit }: EquipmentInfoSectionProps) => (
  <SectionCard
    title={t('user:equipment_info') || 'Equipment Info'}
    readOnly={readOnly}
    onEdit={onEdit}
  >
    <Stack spacing={3}>
      {creator.equipmentInfo && Object.keys(creator.equipmentInfo || {}).length > 0 ? (
        <Stack spacing={3}>
          {Object.entries(creator.equipmentInfo || {}).map(
            ([category, items]: [string, string[]]) => (
              <Box
                key={category}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.light',
                    boxShadow: 1,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: 'text.primary',
                    textTransform: 'capitalize',
                    fontSize: '1rem',
                  }}
                >
                  {category}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    flexWrap: 'wrap',
                    gap: 1,
                    '& > *': {
                      marginLeft: '0 !important',
                    },
                  }}
                >
                  {Array.isArray(items) &&
                    items.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: 'secondary.light',
                            borderColor: 'secondary.main',
                          },
                        }}
                      />
                    ))}
                </Stack>
              </Box>
            )
          )}
        </Stack>
      ) : (
        <Box
          sx={{
            p: 5,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: 'grey.50',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.light',
              bgcolor: 'rgba(25, 118, 210, 0.02)',
            },
          }}
        >
          <DevicesOtherOutlined sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            {t('user:list_equipment_help')}
          </Typography>
        </Box>
      )}
    </Stack>
  </SectionCard>
);

export default EquipmentInfoSection;
