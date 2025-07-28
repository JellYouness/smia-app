import React from 'react';
import SectionCard from '@modules/users/components/SectionCard';
import InfoItem from '@modules/users/components/InfoItem';
import { Business, LocationOn } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';

interface AmbassadorBusinessInfoSectionProps {
  ambassador: Ambassador;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const AmbassadorBusinessInfoSection = ({
  ambassador,
  t,
  readOnly,
  onEdit,
}: AmbassadorBusinessInfoSectionProps) => (
  <SectionCard
    title={t('user:business_info') || 'Business Info'}
    readOnly={readOnly}
    onEdit={onEdit}
  >
    <InfoItem
      label={t('user:years_in_business') || 'Years in Business'}
      value={ambassador.yearsInBusiness}
      icon={<Business />}
    />
    <InfoItem
      label={t('user:business_address') || 'Business Address'}
      value={[
        ambassador.businessStreet,
        ambassador.businessCity,
        ambassador.businessState,
        ambassador.businessPostalCode,
        ambassador.businessCountry,
      ]
        .filter(Boolean)
        .join(', ')}
      icon={<LocationOn />}
    />
  </SectionCard>
);

export default AmbassadorBusinessInfoSection;
