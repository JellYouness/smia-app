import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { VerifiedOutlined } from '@mui/icons-material';
import { TFunction } from 'next-i18next';
import { Creator, Certification } from '@modules/creators/defs/types';

interface CertificationsSectionProps {
  creator: Creator;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const CertificationsSection = ({ creator, t, readOnly, onEdit }: CertificationsSectionProps) => (
  <SectionCard
    title={t('user:certifications') || 'Certifications'}
    readOnly={readOnly}
    onEdit={onEdit}
  >
    <Stack spacing={3}>
      {creator.certifications && creator.certifications.length > 0 ? (
        creator.certifications.map((cert: Certification, index: number) => (
          <Box
            key={index}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'success.main',
              borderRadius: 2,
              bgcolor: 'background.paper',
              position: 'relative',
              '&:hover': {
                borderColor: 'success.dark',
                boxShadow: 1,
                '& .certification-icon': {
                  bgcolor: 'success.dark',
                },
              },
            }}
          >
            <Box
              className="certification-icon"
              sx={{
                position: 'absolute',
                top: 32,
                right: 24,
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
              }}
            />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'success.dark' }}>
              {cert.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              {t('user:issued_by')}: {cert.issuer}
            </Typography>
            {cert.date && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {t('user:date')}: {cert.date}
              </Typography>
            )}
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
          <VerifiedOutlined sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            {t('user:ing_certifications_help')}
          </Typography>
        </Box>
      )}
    </Stack>
  </SectionCard>
);

export default CertificationsSection;
