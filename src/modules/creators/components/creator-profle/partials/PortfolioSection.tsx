import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import CardList from '@modules/users/components/CardList';
import Link from 'next/link';
import { InfoOutlined } from '@mui/icons-material';
import { TFunction } from 'next-i18next';
import { Creator } from '@modules/creators/defs/types';

interface PortfolioSectionProps {
  creator: Creator;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const PortfolioSection = ({ creator, t, readOnly, onEdit }: PortfolioSectionProps) => (
  <SectionCard title={t('user:portfolio') || 'Portfolio'} readOnly={readOnly} onEdit={onEdit}>
    <CardList
      items={creator.portfolio || []}
      renderCard={(item) => (
        <Box
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'primary.main',
            bgcolor: 'background.paper',
            borderRadius: 2,
            mb: 2,
            '&:hover': {
              borderColor: 'primary.dark',
              boxShadow: 1,
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
            {item.description}
          </Typography>
          {item.url && (
            <Link href={item.url} target="_blank" rel="noopener noreferrer">
              <Button variant="gradient" size="small" color="primary">
                {t('user:view_project')}
              </Button>
            </Link>
          )}
        </Box>
      )}
      fallback={
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
          <InfoOutlined sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            {t('user:showcase_your_best_work')}
          </Typography>
        </Box>
      }
    />
  </SectionCard>
);

export default PortfolioSection;
