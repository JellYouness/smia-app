import React from 'react';
import { Grid, Chip } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';

interface AmbassadorSpecializationsSectionProps {
  ambassador: Ambassador;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const AmbassadorSpecializationsSection = ({
  ambassador,
  t,
  readOnly,
  onEdit,
}: AmbassadorSpecializationsSectionProps) => (
  <SectionCard
    title={t('user:specializations') || 'Specializations'}
    readOnly={readOnly}
    onEdit={onEdit}
  >
    <Grid container spacing={1}>
      {(ambassador.specializations || []).map((spec: string, idx: number) => (
        <Grid item key={idx}>
          <Chip label={spec} color="primary" variant="outlined" />
        </Grid>
      ))}
    </Grid>
  </SectionCard>
);

export default AmbassadorSpecializationsSection;
