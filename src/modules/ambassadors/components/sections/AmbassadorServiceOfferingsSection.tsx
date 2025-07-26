import React from 'react';
import { Chip, Typography } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';

interface AmbassadorServiceOfferingsSectionProps {
  ambassador: Ambassador;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const AmbassadorServiceOfferingsSection = ({
  ambassador,
  t,
  readOnly,
  onEdit,
}: AmbassadorServiceOfferingsSectionProps) => (
  <SectionCard
    title={t('user:service_offerings') || 'Service Offerings'}
    readOnly={readOnly}
    onEdit={onEdit}
  >
    {ambassador.serviceOfferings?.length > 0 ? (
      ambassador.serviceOfferings.map((service: string, idx: number) => (
        <Chip key={idx} label={service} color="primary" variant="outlined" />
      ))
    ) : (
      <Typography variant="body2" color="text.secondary">
        {t('user:no_service_offerings') || 'No service offerings provided.'}
      </Typography>
    )}
  </SectionCard>
);

export default AmbassadorServiceOfferingsSection;
