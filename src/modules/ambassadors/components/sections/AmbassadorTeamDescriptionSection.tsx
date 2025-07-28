import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { TFunction } from 'i18next';
import { Ambassador, FeaturedWork } from '../../defs/types';

interface AmbassadorTeamDescriptionSectionProps {
  ambassador: Ambassador;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const AmbassadorTeamDescriptionSection = ({
  ambassador,
  t,
  readOnly,
  onEdit,
}: AmbassadorTeamDescriptionSectionProps) => (
  <SectionCard
    title={t('user:team_description') || 'Team Description'}
    readOnly={readOnly}
    onEdit={onEdit}
  >
    <Typography variant="body1" sx={{ mb: 2 }}>
      {ambassador.teamDescription}
    </Typography>
    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
      {t('user:featured_work') || 'Featured Work'}:
    </Typography>
    {Array.isArray(ambassador.featuredWork) && ambassador.featuredWork.length > 0 ? (
      <List dense>
        {ambassador.featuredWork.map((work: FeaturedWork, idx: number) => (
          <ListItem key={idx}>
            <ListItemText primary={work.description} />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography variant="body2" color="text.secondary">
        {t('user:no_featured_work') || 'No featured work provided.'}
      </Typography>
    )}
  </SectionCard>
);

export default AmbassadorTeamDescriptionSection;
